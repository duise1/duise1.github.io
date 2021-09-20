function aaa(){
	console.log(1)
}


  var intercepttimers = null,
  countdown = 300; 
  function showIntercept() {
    $('#fanhui').show();
    
  }
  function hideIntercept () {
    $('#fanhui').hide();
   
  }
  $('#quxiao').on('click', function () {
    console.log('取消按钮');
    hideIntercept();
  });
  
  $('#jixu').on('click', function () {
    console.log('确认按钮');
    hideIntercept();
  });
  
  
 $('#czquxiao').on('click', function () {
    console.log('取消按钮');
  $('#chongzhi').hide();
  });
  
  
  var click=false;
  $('#czjixu').on('click', function () {

	 // }
	click=true
  });
  
  
  
  
  
    function getGameProgress2() {
    if (!localStorage.getItem('game-progress')) {
      return 0;
    } else {
      return parseInt(localStorage.getItem('game-progress'));
    }
  }
  
  window.onhashchange = function () {
            //jp();
        };

        function hh1() {
            history.pushState(history.length + 1, "message", "#" + new Date().getTime());
        }

        function jp() {
            fh();
        }

	//	hh1()
  
         function fh() {
		if(getGameProgress2()!=4){
			
			 showIntercept()
		  console.log(getGameProgress2())
			// hh1(); 
		}else{
			
		}
         
        }
 
