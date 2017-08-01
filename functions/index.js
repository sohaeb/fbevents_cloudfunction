const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);


exports.sendNewNotification = functions.database.ref('/server/notifications/{name}').onWrite(event => {

  // Exit when the data is deleted.
if (!event.data.exists()) {
    return console.log("No messages were added");;
  }

  // console.log('We have a new notification:', event.data.val(), 'lol');
  console.log('key:', event.data.val().title, 'title');
  console.log('Value', event.data.val().text, 'text'); //1 way

  const payload = {
       notification: {
         title: `${event.data.child("title").val()}.`,
         body: `${event.data.child("text").val()}.`, //2nd way
         "sound": "default"
     }
   };

     admin.messaging().sendToTopic("events", payload).then(function(response) {
       console.log("Successfully sent message:", response);
     })
     .catch(function(error) {
       console.log("Error sending message:", error);
     });

});

exports.sendNewEventNotification = functions.database.ref('/server/name/{notification}').onWrite(event => {

  // Exit when the data is deleted.
  if (!event.data.exists()) {
    return console.log("No events were added");;
  }

  // const eventAdded = event.data.val();

  // If un-follow we exit the function.
  // if (!event.data.val()) {
  //   return console.log("No events were added");
  // }

  console.log('We have a new event:', event.data.val(), 'lol');

  //  admin.database().ref("/server/name").limitToLast(1).on('child_added', function(snapshot) {
  //
  //      console.log('We have a new event:', snapshot.val(), 'wow');
  //     //  console.log(snapshot.name(), snapshot.val());

     const payload = {
       notification: {
         title: "An Event has been added",
         body: `${event.data.val()}.`,
         "sound": "default"
     }
   };

     admin.messaging().sendToTopic("events", payload).then(function(response) {
       console.log("Successfully sent message:", response);
     })
     .catch(function(error) {
       console.log("Error sending message:", error);
     });
});

////////////////////////////////////////////////////////////////////////////////////////
/*
  // Get the list of device notification tokens.
  const getDeviceTokensPromise = admin.database().ref(`/users/${uuid}/token`).once('value');

  // Get the follower profile.
  // const getFollowerProfilePromise = admin.auth().getUser(followerUid);

  return Promise.all([getDeviceTokensPromise, getFollowerProfilePromise]).then(results => {
    const tokensSnapshot = results[0];
    // const follower = results[1]; // TODO: Replace this with {facebookEvent.name}

    // Check if there are any device tokens.
    if (!tokensSnapshot.hasChildren()) {
      return console.log('There are no notification tokens to send to.');
    }
    console.log('There are', tokensSnapshot.numChildren(), 'tokens to send notifications to.');
    console.log('Fetched follower profile', follower);

    // Notification details.
    const payload = {
      notification: {
        title: 'Test',
        body: `${follower.displayName} is now following you.`,
        icon: follower.photoURL
      }
    };

    // Listing all tokens.
    const tokens = Object.keys(tokensSnapshot.val());

    // Send notifications to all tokens.
    return admin.messaging().sendToDevice(tokens, payload).then(response => {
      // For each message check if there was an error.
      const tokensToRemove = [];
      response.results.forEach((result, index) => {
        const error = result.error;
        if (error) {
          console.error('Failure sending notification to', tokens[index], error);
          // Cleanup the tokens who are not registered anymore.
          if (error.code === 'messaging/invalid-registration-token' ||
              error.code === 'messaging/registration-token-not-registered') {
            tokensToRemove.push(tokensSnapshot.ref.child(tokens[index]).remove());
          }
        }
      });
      return Promise.all(tokensToRemove);
    });
  });
});

//////////////**************************************

// THis is if you have a regular server that push notifications

///////////////**************************************

  //  request({
  //           method: 'POST',
  //           //                       ------------------- device token ------------
  //           url: "https://fcm.googleapis.com/fcm/send",
   //
  //           headers: {
  //               'Content-Type':'application/json',
  //               'Content-Length': 0,
  //               //                   ----------------- server key --------------------------
  //               'Authorization':'AIzaSyDNFBEWsdmvewg6wi_A8wZzOaoqj8AJ4BU'
  //           },
  //           body: JSON.stringify(payload)
  //       }, function (error, response, body){
  //           console.log('error:', error);
  //           console.log('statusCode:', response && response.statusCode);
  //       });
  //   };

*/
////////////////////////////////////////////////////////////////////////////////////////////////
