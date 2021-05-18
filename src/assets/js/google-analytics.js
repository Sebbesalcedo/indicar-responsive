
// removed the => function and made it function() for backward compatibility
loadScript("https://www.google-analytics.com/analytics.js", function() {

  window.ga=window.ga||function(){ (ga.q=ga.q||[]).push(arguments); };
  ga.l=+new Date();

  // removed the ga calls form here, they are now called in the service.
  // this is more flexible and configurable.  UAID's can be be stored in the environment.*.ts files

});


function loadScript(url, callback){

  var script = document.createElement("script");
  script.type = "text/javascript";

  if (script.readyState){  //IE
      script.onreadystatechange = function(){
          if (script.readyState == "loaded" ||
                  script.readyState == "complete"){
              script.onreadystatechange = null;
              callback();
          }
      };
  } else {  //Others
      script.onload = function(){
          callback();
      };
  }

  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
}
