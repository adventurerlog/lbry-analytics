const utils = require('./utils');
const { Lbry } = require("lbry-redux");
const jsonHighlight = require('./json-syntax');
const api = require('./http-api');

/**
 * Utils
 */

const getTabs = _=>({
    home: 'home',
    analytics:'analytics',
    rawExec: 'raw-exec'
});

/** 
 * Components 
 */

const Home = () =>({
    data:function(){
        return {};
    }
});

const Menu = () =>({
        data: function(){
            return {
                tabs: getTabs(),
            };
        },
        methods:{
            changeTab: function(tab){
                this.$dispatch('changeTab',tab);
            }
        }
});

const Analytics = () =>({
        data: function(){
            return {
                channels:[],
                streams:[],
                token:localStorage.getItem('auth_token'),
                channelName: localStorage.getItem('channel_name_cache'),
                totalViews:0,
                now: new Date().getTime(),
                streamsNotFound: {
                    status: false,
                    text:''
                },
                table:{
                    show: false,
                    headers:[
                        'Name',
                        'Release Date',
                        'Tags(len)',
                        'Comments (len)',
                        'View Count',
                        'Total Support',
                        'Suport',
                        'Trending Global',
                        'Trending Group',
                        'Trending Local',
                        'Trending mixed'
                    ]
                }
            }
        },
        methods:{
            loadTable: function() {
                if(!!this.token){
                    this.totalViews = 0;

                    this.populateStreams().then(()=>{
                        api.getViewCount(this.streams.map(s=>s.claim_id), this.token ,(counts)=>{
                            if(counts.success){
                                this.totalViews = 0;
                                counts.data.map((count,index)=>{
                                    this.streams[index].views = count;
                                    this.totalViews += count;
                                });
                                this.table.show = true;
                                localStorage.setItem('auth_token', this.token);
                            }
                        });
                    })  
                }
            },
            noResults: function(channelName) {
                return `No results we found for the ${channelName} channel. Try Something else`
            },
            populateStreams: function() {
                return new Promise((resolve, reject)=>{
                    if (!this.channelName){
                        reject('No channel is written there');
                        return;
                    }
                    let search_claim = { channel: this.channelName };
                    try {
                        search_claim = JSON.parse(this.channelName)
                    } catch(e){}
                    Lbry.claim_search({ ...search_claim, page_size:2000}).then(data=>{
                        this.streams = [];
                        if(!data.items.length) {
                            this.streamsNotFound.status = true;
                            this.streamsNotFound.text = this.noResults(this.channelName);
                        }
                        
                        data.items.map(stream=>{   
                            // console.log(s)         
                            this.streams.push({
                                ...stream,
                                amount:+stream.amount,
                                meta:{
                                    ...stream.meta,
                                    support_amount:+stream.meta.support_amount,
                                    effective_amount:+stream.meta.effective_amount,
                                },
                                value: {
                                    ...stream.value,
                                    release_time:utils.timeElapsed(+stream.value.release_time)
                                },
                                comments_len: 666,
                                views:666
                            });  
                        });
                        console.log(this.streams);
                        this.streams.map(stream=>{
                            Lbry.comment_list({claim_id:stream.claim_id}).then(comment_list=>{
                                this.streams.map(s=>{
                                    if(stream.claim_id===s.claim_id){
                                        s.comments_len = comment_list.total_items;
                                        stream.comments_len = comment_list.total_items;
                                    }
                                });
                            });
                        });
                        if(!!this.channelName){
                            localStorage.setItem('channel_name_cache',this.channelName);
                        }
                        resolve();
                    }).catch(e=>console.error(e));
                });
            }
        },
        created: function() {
            // created Hook
        }
      });

const RawExec = () =>({
        data: function(){
            return {
                helpHTML:``,
                execHTML:``,
                sdkStruct:{},
                commandName:'',
                commandParams:''
            }
        },
        created: function(){
            
            Lbry.version().then(version=>{
    
                this.sdkStruct = { __SDK_VERSION: version };
                Object.keys(Lbry).map(key => {
                    this.sdkStruct[key]=typeof Lbry[key];
                });
                this.helpHTML = jsonHighlight(this.sdkStruct);
            });
        },
        methods:{
            runCommand: function(){
                if(!this.commandName){
                    alert('You must input a command!');
                    return;
                } else {
                    if(typeof Lbry[this.commandName] === 'function'){
                        Lbry[this.commandName].apply(this.commandParams.split(',')).then(result=>{
                            // console.log(`ran ${this.commandName} with ${this.commandParams}`);
                            // console.log(result);
                            this.execHTML = jsonHighlight(result);
                        }).catch(e=>{
                            this.execHTML = jsonHighlight(e);
                        });
                    } else {
                        this.execHTML = jsonHighlight(Lbry[this.commandName]);
                    }
                }
            }
        }
        
    });


const MainInstance = ()=>({
        el: '#app',
        data: {
            // TODO: should be home as default
            currentTab: getTabs().analytics
        },
        events: {
            'changeTab': function (tab) {
              this.currentTab = tab;
            }
        }
});



const components = [
    { Name:'menu', body: Menu },
    { Name:'home', body: Home },
    { Name:'raw-exec', body: RawExec},
    { Name:'analytics', body: Analytics}
];
module.exports = (Vue)=>{
    components.forEach(component => {     
        Vue.component(component.Name, {
            template: utils.getTemplate(component.Name),//require(`./templates/${component.Name}`),
            ...component.body()
        });
    });
    new Vue(MainInstance());
}