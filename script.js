var ansList = {}, d, matchres=0, totlen=0;

function shuffle(o){
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
};

function UITest1() {

	$.ajax({
        type: "GET" ,
        url: "data.xml" ,
        dataType: "xml" ,
        success: function(xml) {
			loadXMLData(xml);
		}
    }).done(function() {
		$("#wrapper").on('click','.questions:visible:last input[type="radio"]',function () {
			//alert(1);
			var vislen = $('input[type="radio"]:checked').length,
			quelen = $(".questions").length;
			$("#nextButton").removeAttr("disabled");
			if(vislen == quelen) {
				$("#nextButton").text("Show Answer");
			}
		});
	});
}

function loadXMLData(data) {
	console.log(data);
	d = data;
	$("#wrapper").html("");
	$data = shuffle($(d).find('question'), data);
	$data.each(function(e) {
		var THIS = $(this);
		var qval = THIS.find("question_text").text();
		//ansr = THIS.find("question_text").attr("answer");
		ansList[qval.replace(/ /gi,'')] = THIS.find("question_text").attr("answer");
		
		var setVar = "<div id='"+qval.replace(/ /gi,'')+"' class='questions'><p><strong>"+qval+"</strong></p><ul class='options'>";
		THIS.find("options option").each(function() {
			var optionvar = "<li><input type='radio' value='"+$(this).html()+"' name='"+qval.replace(/ /gi,'')+"'>"+$(this).html()+"</li>";
			setVar+=optionvar;
		});
		setVar+="</ul><p class='answer'></p></div>";
		$("#wrapper").append(setVar);
	});
	$("#wrapper").append('<p><button id="nextButton" onclick="FunNextNode()" disabled>Next</button> <button id="restart" onclick="reset();">Restart</button></p>');
	console.log(ansList);
}

function FunNextNode() {
	//console.log();
	txtval = $("#nextButton").text();
	var vislen = $(".questions:visible").length,
		quelen = $(".questions").length;
	if(vislen!=quelen && txtval!="Show Answer") {
		var t1 = $(".questions:visible");
		t1.hide();
		t1.next().fadeIn(800);
		$("HTML, BODY").animate({ scrollTop: $("#wrapper").offset().top}, 1000); 
		$("#nextButton").attr("disabled","true");
	} else {
		if(!($("#result").css("display")!="none")) {
			checkAns();
		}
	}
}

function checkAns() {
	$("#result").show();
	$(".wrong").removeClass("wrong");
	$(".right").removeClass("right");
	$(".questions").show();
	$(".questions").each(function(index) {
		var chekedval = $(this).find("input:checked").val();
		//chekedvalnum = ;
		var ht = $(".questions")[index];
		var idvalue = $(this).attr("id");
		console.log();
		var htmlstr = "The Answer is <strong>Option "+ansList[idvalue]+"</strong>";
		$(ht).find('.answer').html(htmlstr);
		if(ansList[idvalue] == chekedval.replace(/Option /gi,"")) {
			$(this).find("input:checked").parent("li").addClass("right");
			matchres++;
		} else {
			$(this).find("input:checked").parent("li").addClass("wrong");
		}
		totlen++;
	});
	$("#noofques").html("<strong>"+totlen+"</strong>");
	$("#noofcorans").html("<strong>"+matchres+"</strong>");
	
}

function reset() {
	$('input[type="radio"]').prop("checked",false);
	$(".questions,#result").hide();
	$(".questions:first-child").show(500);
	$("#nextButton").text("Next").attr("disabled","true");
	$(".answer,#noofques,#noofcorans").html("");
	$(".wrong").removeClass("wrong");
	$(".right").removeClass("right");
	ansList = {};
	matchres=0;
	totlen=0;
}

