# JsPsych 实验设计详细教程

## 目录

1. 简介
2. 安装与设置
3. 基本概念
4. 创建 Stroop 实验
5. 数据收集与分析
6. 高级功能与插件
7. 常见问题

---

## 1. 简介

JsPsych 是一个强大的 JavaScript 库，用于在 Web 浏览器中创建行为实验。它允许研究人员设计复杂的心理学实验，并通过互联网分发它们。本教程旨在帮助初学者从零开始学习如何使用 JsPsych 设计和实施 Stroop 实验。

---

## 2. 安装与设置

### 2.1 下载 JsPsych

首先，前往 [JsPsych 的 GitHub 页面](https://github.com/jspsych/jsPsych) 或 [官网](https://www.jspsych.org/)，下载最新版本的 JsPsych 库。你也可以通过 npm 或 yarn 来安装它：

```bash
npm install jspsych
```

### 2.2 创建基本文件结构

创建一个包含以下文件和文件夹的项目目录：

```
stroop-experiment/
│
├── index.html
├── js/
│   ├── jspsych.js
│   ├── jspsych-html-keyboard-response.js
│   └── exp.js
└── css/
    └── default.css
```

将下载的 `jspsych.js` 和 `jspsych-html-keyboard-response.js` 文件放入 `js/` 文件夹中。

### 2.3 设置 HTML 文件

在 `index.html` 中包含以下基本代码：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>Stroop Test</title>
  <!-- 引入 JsPsych 核心库和样式表 -->
  <script src="js/jspsych.js"></script>
  <link rel="stylesheet" href="css/default.css">

  <!-- 引入 JsPsych 插件 -->
  <script src="js/jspsych-html-keyboard-response.js"></script>
</head>
<body>
    <div id="main-container">
        <script src="js/exp.js"></script> <!-- 载入实验脚本 -->
    </div>  
</body>
</html>
```

### 2.4 设置 CSS 文件

在 `default.css` 文件中添加以下样式：

```css
/* 基本的页面样式 */
body {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  background-color: #f0f0f0;
}

.container {
  width: 80%;
  max-width: 800px;
  text-align: center;
}

.instructions-container {
  margin-bottom: 20px;
}

.stimulus-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.stimulus-item {
  width: 250px;
  height: 250px;
  margin: 25px;
  padding: 25px;
  border: 2px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 36px;
}

.thank-you {
  font-size: 48px;
  margin-top: 50px;
}

.feedback {
  font-size: 48px;
}

.start-formal {
  font-size: 48px;
}
```

---

## 3. 基本概念

### 3.1 实验时间线

在 JsPsych 中，实验由一系列称为“时间线”的试验（trial）组成。时间线是一个数组，每个元素都是一个试验对象。

### 3.2 试验对象

每个试验对象都包含试验类型（type）和其他参数。常见的试验类型包括 `html-keyboard-response` 等。

### 3.3 插件

JsPsych 提供了许多插件用于不同类型的试验。每个插件都有其独特的参数和功能。

---

## 4. 创建 Stroop 实验

### 4.1 显示实验说明

在 `exp.js` 中添加以下代码，设置实验说明页面：

```javascript
document.addEventListener('DOMContentLoaded', function() {
    // 显示实验说明
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
```

### 4.2 定义试次和颜色列表

继续在 `exp.js` 中定义颜色和词语列表，以及练习和正式实验阶段的试次：

```javascript
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
```

### 4.3 显示反馈信息

定义一个函数用于获取反馈信息：

```javascript
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
```

### 4.4 练习和正式测试阶段

定义练习测试和正式测试阶段的时间线：

```javascript
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
```

### 4.5 显示感谢页面并初始化实验

最后，设置实验结束后的感谢页面，并初始化 JsPsych：

```javascript
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
```

---

## 5. 数据收集与分析

### 5.1 数据格式

JsPsych 可以将实验数据导出为 JSON 格式，方便后续分析。在本实验中，数据将自动记录每次试验的反应时间、正确与否等信息。

### 5.2 数据导出

在实验结束时，使用 `jsPsych.data.get().json()` 方法获取实验数据，并将其打印到控制台。你可以进一步扩展代码，将数据发送到服务器或下载为文件。

---

## 6. 高级功能与插件

### 6.1 使用其他插件

JsPsych 提供了许多插件用于不同类型的试验，如音频反应、视频反应、拖放排序等。你可以在 [JsPsych 插件文档](https://www.jspsych.org/plugins/) 中找到更多信息，并根据需求添加到实验中。

### 6.2 自定义试验

你可以根据具体研究需求，自定义试验时间线和反馈机制。例如，添加更多的练习阶段、修改反馈显示时间、增加试验条件等。

---

## 7. 常见问题

### 7.1 实验未加载

确保所有 JsPsych 库和插件文件路径正确，并且已在 HTML 文件中正确引用。

### 7.2 数据未记录

检查 `on_finish` 回调函数，确保数据正确保存。你可以在每个试验结束后使用 `console.log(data)` 打印调试信息。

### 7.3 其他问题

参考 JsPsych 官方文档和社区论坛，寻找类似问题的解决方案，或向社区求助。

---

通过本教程的学习，你应该能够从零开始设计并实现一个简单的 Stroop 实验。祝你在研究中取得成功！
