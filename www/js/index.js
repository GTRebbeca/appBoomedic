/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("offline", this.checkState, false);        
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.setupPush();   
    },
    checkState: function(){
        //alert('Estoy offline');
        window.location.href = "offline.html";
    },
    setupPush: function() {
        console.log('calling push init');
        var push = PushNotification.init({
            "android": {
                 "senderID": "53264507263",
                 "icon": "https://cdn4.iconfinder.com/data/icons/flat-shaded-2/512/Notification-512.png",
                 "vibrate": true 
            },
            "browser": {
                 "pushServiceURL": "http://push.api.phonegap.com/v1/push"
             },
            "ios": {
                "senderID": "53264507263",
                "sound": false,
                "badge": true,
                "alert": true,
                "gcmSandbox":true
            },
            "windows": {}
        });

        push.on('registration', function(data) {
             var devicePlatform = device.platform;
           var oldRegId = window.localStorage.getItem('registrationId');

                  if (oldRegId !== data.registrationId) {
                        // Save new registration ID
                        window.localStorage.setItem('uuid', device.uuid);
                        window.localStorage.setItem('registrationId', data.registrationId);
                     
                        registerDeviceToken(data.registrationId + '&' + device.uuid);

                   }
        });

        push.on('error', function(e) {
            console.log("push error = " + e.message);
        });

        push.on('notification', function(data) {
            
            console.log('notification event');
            navigator.notification.alert(
                data.message,         // message
                null,                 // callback
                data.title,           // title
                'Ok'                  // buttonName
            );
       });

            function registerDeviceToken(deviceToken){
                
                                 $.ajax(
                                    {
                                      type: "GET",    
                                      url: "https://sbx00.herokuapp.com/fcm/" + deviceToken, 
                                      success: function(result){
                                        //Token de registro en tabla de devices
                                      },
                                      error: function (jqXHR, exception) {
                                            var msg = '';
                                            if (jqXHR.status === 0) {
                                                msg = 'Not connect.\n Verify Network.';
                                            } else if (jqXHR.status == 404) {
                                                msg = 'Requested page not found. [404]';
                                            } else if (jqXHR.status == 500) {
                                                msg = 'Internal Server Error [500].';
                                            } else if (exception === 'parsererror') {
                                                msg = 'Requested JSON parse failed.';
                                            } else if (exception === 'timeout') {
                                                msg = 'Time out error.';
                                            } else if (exception === 'abort') {
                                                msg = 'Ajax request aborted.';
                                            } else {
                                                msg = 'Uncaught Error.\n' + jqXHR.responseText;
                                            }
                                            console.log(msg);
                                        },
                                    })
            }
    }
};