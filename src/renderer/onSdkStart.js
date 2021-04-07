// Wait until the sdk is fully started before doing anything else
const onSdkStart = (Lbry,callback) =>{
    
    const checkSDKStarted = (callback) => {
        Lbry.status().then(status => {
             
          if (status.is_running) {
            // SDK is now running            
            return callback();
          }
          /**TODO: make sure this doesn't run for ever in case of failure */
          setTimeout(() => {
            checkSDKStarted(callback);
          }, 500);
        });
      }
    Lbry.connect().then(()=>checkSDKStarted(callback));  
}


module.exports = onSdkStart;