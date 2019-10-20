var functions=require('firebase-functions')
var admin=require('firebase-admin')

admin.initializeApp(functions.config().firbase)

exports.onWaterLevelUpdated = functions.database
.ref('/Jodhpur/{JodhpurId}')
.onUpdate((change, context)=> {
	
	const before=change.before.val()
 	const after=change.after.val()
		
	
        
	if(before.Wlevel!==after.Wlevel&&after.Wlevel===3){
		
		
		var counter=0;
		var ref=admin.database().ref('Jodhpur')
      		
		ref.once("value")
  		.then( function(snapshot) {
     		snapshot.forEach(function(childSnapshot) {
      		
      		var childData = childSnapshot.child('Wlevel').val();
		if(childData===3){
	   		counter=counter+1
			console.log(counter)
	   	
				 }//if

  		})//for
		
		console.log("send Notification")
  		var token=["eSXApv4Bubc:APA91bGdiRWaewCFJdixzP1GBtp3u327_f-S0U7IzdSUycN2supwmzDBeLvEIjmtXuBAQ5dfYHdHv9sJ19l7r3Y9mxjGVdTLoFcdeHozjwh9dsRc-39P-eJgMXi1Iow33SDhkxuOGqn_",
			"ftWMtGt9SBM:APA91bEsT04zbJQKANvkwBTgRxmP1BadwTNKdgHx17Xrj29whgbbkACa076NZQYEMbRYXUnIIJOXhcAMefiHsUaN73WPvZakNhvZn61Bu9R9F0oyrg62xlAY-fvqThiTBvq_HdOCgnFR"];
		var payload={
 			data:{
				title: "Alert!",
				body: counter.toString()+" Devices in critical condition"
				}
			};

		var options={
			priority: "high",
			timeToLive: 60 * 60 *24
			};
		 admin.messaging().sendToDevice(token,payload,options)
		.then(function(response){
		console.log("Successfully sent message:", response);
		return response
		})
		.catch(function(error){
		console.log("error sending message: ", error);
		})

		return counter

  		})//function
  		.catch(function(error){
		console.log("......: ", error);
		})
		
		 }//if 		 
})//on update
	
				
