console.log('-----最初-----');
var db; // init database variable
var userArr = [];
var results_data;
var current_url;
var sendToFriendsList=[];
// steroids.view.navigationBar.show("Hello World");
document.addEventListener("deviceready", onDeviceReady, false);

$(document).ready(function(){
  console.log('-----document.ready-----');
  
  
  // $('.toPange').on('click', function(){
  //   console.log('---toPage-----');
  //   showPage($(this).val());
  // });

  });

function onStartButton() {
  console.log('onStartButton');
  // db.execute("SELECT * FROM testdb.cars" ,{
  //   onSuccess: function(rows, res, tx){
  //     console.log("rows: "+rows, "res: "+res, "tx: "+tx);
  //   },
  //   onFailure: function(err) {
  //     console.log(err.message);
  //   }
  // });
  console.log(db,db.execute);
  var cmd = 'SELECT car_id, name FROM cars';
  db.execute(cmd, {
    onSuccess: function(rows, res, tx){
      alert("Well done!");
      console.log("rows: "+rows, "res: "+res, "tx: "+tx);
    },
    onFailure: function(err) {
      alert(err.message);
    }
  });
}

function onDeviceReady() {
  console.log('-----onDeviceReady-----');

  // var backButton = new steroids.buttons.NavigationBarButton();
  // backButton.title = ">>";
  // steroids.view.navigationBar.setButtons({
  //   right: [backButton]
  // });

  var str = 'http://business.nikkeibp.co.jp';
  $.ajax({
    // crossDomain: true, 
    type: "POST",
    dataType: "json",
    url:"//easy-share-news.appspot.com/article/scraping_business/"
  }).done(function(data){
    console.log(data);
    var json_data = data;
    if(json_data.status == 'success'){
        $.each(json_data.results,function(i,val){
            var url_str = str + val.url;
            var tmp_html = '';
            tmp_html += '<h4>';
            tmp_html += val.title;
            tmp_html += '</h4>';
            tmp_html += '<p>';
            tmp_html += '<button type="button" class="btn btn-primary webview_btn" value="'+url_str+'" onClick="showPage('+"'"+url_str+"'"+')">';
            tmp_html += '<label>more &raquo; </label>';
            tmp_html += '</button>';
            tmp_html += '<a href="http://line.naver.jp/R/msg/text/?LINE%E3%81%A7%E9%80%81%E3%82%8B%0D%0Ahttp%3A%2F%2Fline.naver.jp%2F"><img src="[ボタン画像のURL]" width="[ボタン幅]" height="[ボタン高さ]" alt="LINEで送る" /></a>'
            tmp_html += '</p>';
            $('div#title_sample').append(tmp_html);
        });
    }
          
    }).success(function(data){
      // 成功するとContactsの読み込みに入る
        var options = new ContactFindOptions();
        options.filter = "";
        options.multiple = true; // これがfalseだとアドレスは一件しかとれない。  
        fields = ["displayName","emails"];
        
        navigator.contacts.find(fields, onSuccess, onError, options);
        
    }).error(function(data){
        
    });

    // $('button.webview_btn').on('click',function(){
    //   console.log('click'+$(this).val());
    //   current_url = String($(this).val());
    // });
    // steroids.on("ready", initDatabase);
}

function onSuccess(contacts) {
  console.log('success-contacts3');
  for (var i=0; i<contacts.length; i++) {
    // console.log("displayName: " + contacts[i].displayName,contacts[i].id );
    if(contacts[i].emails != null){
        userArr.push([contacts[i].displayName, contacts[i].emails[0].value]);
        // console.log("emails: " + contacts[i].emails[0].value);
      }
    }
    var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(populateDB, errorCB, successCB);
}
function onError(contactError) {
    alert('onError!');
}

function cameraGetPicture() {

  document.addEventListener("deviceready", onDeviceReady, false);

  console.log('---camera--');
    navigator.camera.getPicture(imageReceived, cameraFail, {
      quality: 100,
      destinationType: Camera.DestinationType.FILE_URI,
      correctOrientation: true,
      targetWidth: 600
    });
  }
function imageReceived(imageURI) {
    var image = document.querySelector('img#myImage');
    image.src = imageURI;
}

function cameraFail(message) {
    // alert("Camera error: " + message);
}
function show() {
  var webView = new steroids.views.WebView("show.html");
  steroids.layers.push(webView);
}
function showPage(url) {
  current_url = url;
  window.localStorage.setItem("current_url_key", current_url);
  var webView = new steroids.views.WebView(url);
  steroids.layers.push(webView);
}

steroids.view.navigationBar.show("news");

var animation = new steroids.Animation( {
 transition: "curlUp",
 duration: 0.8,
 curve: "easeIn"
} );

var times = 0;

function animationSuccess() {
 times++;
 document.getElementById("status").textContent = "Animation performed " + times + " times!";
}

function performAnimation() {

 animation.perform(
   {}, 
   { onSuccess: animationSuccess }
 );

}
// var leftDrawer = new steroids.views.WebView("friends.html");
var leftDrawer = new steroids.views.WebView("friends.html");
// alert(leftDrawer.location);
// alert(leftDrawer.params);
leftDrawer.preload({}, {
  onSuccess: initGesture
});

function initGesture() {
  steroids.drawers.enableGesture(leftDrawer);
}

function populateDB(tx) {
  // alert(userArr[0][0]+userArr[0][1]);
  tx.executeSql('DROP TABLE IF EXISTS DEMO');
  tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id unique, displayName, emails)');
  for(var i=0;i<userArr.length;i++){
    // console.log('INSERT INTO DEMO (id, displayName, emails) VALUES ('+i+','+'"'+String(userArr[i][0])+'"'+','+'"'+String(userArr[i][1])+'"'+')');
    tx.executeSql('INSERT INTO DEMO (id, displayName, emails) VALUES ('+i+','+'"'+String(userArr[i][0])+'"'+','+'"'+String(userArr[i][1])+'"'+')');
  }
}

function queryDB(tx) {
  tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCB);
}

function querySuccess(tx, results) {
  // alert(typeof(results.rows));
  console.log("Returned rows = " + results.rows.length);
  results_data = results.rows;
  console.log(results_data);
  var htm = '';
  for (var i=0; i<results.rows.length; i++){
    // console.log("Row = " + i + " ID = " + results.rows.item(i).id + " DisplayName =  " + results.rows.item(i).displayName + " Emails =  " + results.rows.item(i).emails);
      htm += '<p><input type="checkbox" class="user_contacts" value="'+results.rows.item(i).emails+'">';
      htm += results.rows.item(i).displayName;
      htm += '</p>'; 
  }
  $('#user_data').append(htm);
  if(!results.rowsAffected) {
    console.log('No rows affected!');
    return false;
  }
  console.log("Error proccessing SQL: "+ err.code);

}

function addFriendsList() {
  alert(results_data);
  var htm = '';
  for (var i=0; i<results_data.length; i++){
      htm += '<p><input type="checkbox" value="'+results_data.item(i).emails+'">';
      htm += results_data.item(i).displayName;
      htm += '</p>';
  }
  return htm;
}

function errorCB(err) {
    alert("Error processing SQL: "+err.code);
}

function successCB() {
    // alert("success!");
    var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(queryDB, errorCB);

}


function sendToFriends() {
  console.log('-----sendToFriends-----');
  console.log(window.localStorage.getItem("current_url_key"));
  if(!$('.user_contacts:checked')){
    alert('アドレスを選択してください。');
  }else{
    // <a href="mailto:info@example.com?subject=問い合わせ&amp;body=ご記入ください">メールはこちらへ</a>
    $('.user_contacts:checked').each(function(){
      sendToFriendsList.push($(this).val());
      console.log('sendToFriendsList: '+sendToFriendsList);
      var str = '';
      if(sendToFriendsList.length >1){
        for(var i=0;i<sendToFriendsList.length;i++){
          str += sendToFriendsList[i]+',';
        }
        str.slice(-1);
      }else{
        str = sendToFriendsList[0];
      }

      location.href='mailto:'+str+'?subject=シェアします&body='+window.localStorage.getItem("current_url_key")+'%0d%0aご参考まで';

    });
  }
  
}





// function initDatabase() {

//   var dbPath = steroids.app.path + "/data/Chinook_Sqlite.sqlite"
//   db = window.sqlitePlugin.openDatabase({name: dbPath});

// }

// function runQuery() {
//   db.transaction(queryDB, databaseError);
// }

// // Query the database
// function queryDB(tx) {
//   tx.executeSql('SELECT * FROM ARTIST', [], gotQueryResults, databaseError);
// }

// // Show the results of the database query
// function gotQueryResults(tx, results) {
//   var len = results.rows.length;
//   var result = "";
//   result += ("Artist table: " + len + " rows found. \n\n");
//   for (var i=0; i<len; i++){
//     result += ("Name =  " + results.rows.item(i).Name + "\n");
//   }
//   navigator.notification.alert(result, null, "Database query successful!");
// }

// // Transaction error callback
// function databaseError(err) {
//   navigator.notification.alert("Error code: " + err.code + "; message: " + err.message, null, "Error processing SQL!");
// }



