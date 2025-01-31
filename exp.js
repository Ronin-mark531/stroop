document.addEventListener('DOMContentLoaded', function() {
    // 第一阶段：显示实验说明
    var instructions = {
      type: 'html-keyboard-response',
      stimulus: '<div class="instructions">' +
                '<p>欢迎参加本次实验。</p>' +
                '<p>本实验共两个试次，第一次为练习实验，第二次为正式实验。</p>' +
                '<p>实验中，您将看到不同颜色的方块和不同表示颜色的词语。</p>' +
                '<p>您的任务是忽略词语的含义，又快又准得按下对应颜色的键。</p>' +
                '<p>请按下相应的键：</p>' +
                '<p>红色 - D键</p>' +
                '<p>绿色 - F键</p>' +
                '<p>蓝色 - J键</p>' +
                '<p>黄色 - K键</p>' +
                '<p>准备好后，按任意键开始实验。</p>' +
                '</div>'
    };
  
    // 定义颜色和词语列表
    var colors = ['red', 'green', 'blue', 'yellow'];
    var words = ['红色', '绿色', '蓝色', '黄色'];
  
    // 练习阶段的试次
    var practice_trials = [];
    for (var i = 0; i < colors.length; i++) {
      for (var j = 0; j < words.length; j++) {
        practice_trials.push({
          stimulus: '<div class="stimulus-item" style="background-color:' + colors[i] + ';">' + words[j] + '</div>',
          data: { word: words[j], color: colors[i], congruent: colors[i] == words[j] }
        });
      }
    }
  
    // 正式实验阶段的试次
    var formal_trials = [];
    for (var i = 0; i < colors.length; i++) {
      for (var j = 0; j < words.length; j++) {
        for (var k = 0; k < 6; k++) {
          formal_trials.push({
            stimulus: '<div class="stimulus-item" style="background-color:' + colors[i] + ';">' + words[j] + '</div>',
            data: { word: words[j], color: colors[i], congruent: colors[i] == words[j] }
          });
        }
      }
    }
  
    // 获取试次反馈信息（正确或错误）
    function getFeedback(correct) {
      return correct ? '<p class="feedback" style="color:green;">正确</p>' : '<p class="feedback" style="color:red;">错误</p>';
    }
  
    // 定义一个固定的十字注视点
    var fixation = {
      type: 'html-keyboard-response',
      stimulus: '<div style="font-size: 48px;">+</div>',
      choices: jsPsych.NO_KEYS,
      trial_duration: 500
    };
  
    // 练习阶段的测试
    var practice_test = {
      timeline: [fixation, {
        type: 'html-keyboard-response',
        stimulus: jsPsych.timelineVariable('stimulus'),
        choices: ['d', 'f', 'j', 'k'],
        data: jsPsych.timelineVariable('data'),
        on_finish: function(data) {
          var correct_response = '';
          switch(data.color) {
            case 'red':
              correct_response = 'd';
              break;
            case 'green':
              correct_response = 'f';
              break;
            case 'blue':
              correct_response = 'j';
              break;
            case 'yellow':
              correct_response = 'k';
              break;
          }
          data.correct = data.response == correct_response;
        }
      },
      {
        type: 'html-keyboard-response',
        stimulus: function(){
          var last_trial_data = jsPsych.data.get().last(1).values()[0];
          return getFeedback(last_trial_data.correct);
        },
        choices: jsPsych.NO_KEYS,
        trial_duration: 1000
      }],
      timeline_variables: practice_trials,
      randomize_order: true
    };
  
    // 正式实验阶段的测试
    var formal_test = {
      timeline: [fixation, {
        type: 'html-keyboard-response',
        stimulus: jsPsych.timelineVariable('stimulus'),
        choices: ['d', 'f', 'j', 'k'],
        data: jsPsych.timelineVariable('data'),
        on_finish: function(data) {
          var correct_response = '';
          switch(data.color) {
            case 'red':
              correct_response = 'd';
              break;
            case 'green':
              correct_response = 'f';
              break;
            case 'blue':
              correct_response = 'j';
              break;
            case 'yellow':
              correct_response = 'k';
              break;
          }
          data.correct = data.response == correct_response;
        }
      },
      {
        type: 'html-keyboard-response',
        stimulus: '<div></div>',
        choices: jsPsych.NO_KEYS,
        trial_duration: 1000
      }],
      timeline_variables: formal_trials,
      randomize_order: true
    };
  
    // 实验结束后的感谢页面
    var thank_you = {
      type: 'html-keyboard-response',
      stimulus: '<p class="thank-you">非常感谢您参与实验！</p>',
      choices: jsPsych.NO_KEYS,
      trial_duration: 3000
    };
  
    // 设置实验时间轴并初始化 JsPsych
    var timeline = [];
    timeline.push(instructions);     // 显示说明页面
    timeline.push(practice_test);   // 执行练习测试
    timeline.push({
      type: 'html-keyboard-response',
      stimulus: '<p class="start-formal">练习结束。按任意键开始正式实验。</p>',
      choices: jsPsych.ALL_KEYS
    });
    timeline.push(formal_test);     // 执行正式实验
    timeline.push(thank_you);       // 显示感谢页面
  
    // 初始化 JsPsych，并在实验结束时打印数据到控制台
    jsPsych.init({
      timeline: timeline,
      on_finish: function() {
        console.log(jsPsych.data.get().json());
      }
    });
  });