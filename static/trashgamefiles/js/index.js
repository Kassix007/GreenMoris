const config = {
    lj_width: 100,
    lj_height: 100,
    s1: 8000,
    s2: 2000, // Appearance speed parameter
    point: 0, // User score
    total_wrong: 0, // Failures
    sx: 2,
    sy: 2,
    level: 2,
    total_point: 0,
    box_width: 1200,
    box_height: 400,
};

function setXX(point, total) { // Star rating
    let xx = ['img/xx1.png', 'img/xx2.png'];
    if (point < total / 3) {
        return [xx[0], xx[0], xx[0]];
    } else if (point >= total / 3 && point < total / 2) {
        return [xx[1], xx[0], xx[0]];
    } else if (point >= total / 2 && point < total / 5 * 4) {
        return [xx[1], xx[1], xx[0]];
    } else if (point >= total / 5 * 4) {
        return [xx[1], xx[1], xx[1]];
    }
}

const level1 = {
    speed: 5,
    status: 1
};
let level = level1;

const _time = {
    left: 110,
    top: 20,
    total: 120,
    timer: null,
    endInterval: function() {
        console.log(this);
        clearInterval(this.timer);
    },
    startInterval: function() {
        this.timer = setInterval(() => {
            if (this.total > 0) {
                let text = '';
                let hour = Math.floor(this.total / 3600);
                let min = Math.floor(this.total / 60) % 60;
                let sec = this.total % 60;
                hour = hour < 10 ? '0' + hour : hour;
                min = min < 10 ? '0' + min : min;
                sec = sec < 10 ? '0' + sec : sec;
                text = hour + ':' + min + ':' + sec;
                this.total--;
                $('.time').html(text);
            } else {
                let imgList = setXX(config.point, config.total_point);
                localStorage.setItem('p' + config.level, imgList);
                stopGame();
                let imgtext = '';
                imgList.forEach(ii => {
                    imgtext += '<img src="' + ii + '"/>';
                });
                $('.fail-box').html(
                    `
                    <h2>Game Over</h2>
                    <p>Your score this time is: ${config.point}</p>
                    <div>${imgtext}</div>
                    <button type="button" onclick="location.reload()">Return</button>
                    `
                );
                $('.fail-box').css({
                    display: 'flex'
                });
                this.endInterval();
            }
        }, 1000);
    }
};

$('.time').css({
    'left': _time.left,
    'top': _time.top
});

function startInterval() {}

const lj_box = {
    width: 1200,
    height: 300,
    left: 0,
    bottom: 0,
    dbimg: 'url(img/db.jpg)',
    setPos: function() {
        $('.lj-box').css({
            width: this.width,
            height: this.height,
            left: this.left,
            bottom: this.bottom,
            backgroundImage: this.dbimg,
        });
    }
};

function createLevel2(obj) {}

function l2(obj) {}

function CreateLJ(type, img) {
    this.type = type;
    this.fx = Math.random();
    if (config.level == 1) {
        this.fx = 0.1;
    }
    this.speedX = config.sx;
    this.speedY = config.sy;
    if (config.level == 3) {
        this.startX = Math.random() * 50;
        this.startY = Math.random() * 50;
    } else if (config.level == 1) {
        this.startX = 0;
        this.startY = Math.random() * 200;
    } else {
        this.startX = 0;
        this.startY = Math.random() * 160;
    }

    if (this.fx > 0.5) {
        this.startX = 1150 - this.startX;
        this.speedX = -this.speedX;
        console.log(this.speedX);
    }
    if (config.level == 3) {
        if (Math.random() > 0.5) {
            this.startY = 700 - this.startY;
            this.speedY = -this.speedY;
        }
    }
    this.mX = this.startX;
    this.mY = this.startY;
    this.p1 = null;
    this.flag = 0;
    this.timer = null;
    this.dragX = this.startX;
    this.dragY = this.startY;
    console.log(this);
    let that = this;

    this.lineMove = function() {
        console.log('Move');
        this.stopMove();
        this.timer = setInterval(() => {
            if (_time.total > 30 && _time.total < 35) {
                this.mX += this.speedX;
                this.mY += this.speedY;
            }
            this.mX += this.speedX;
            this.mY += this.speedY;

            if (config.level == 2) {
                if (this.mX > 550 && this.fx <= 0.5 || this.mX < 650 && this.fx > 0.5) {
                    this.speedX = 0;
                    this.speedY = config.sx;
                }
                if(this.mX <= 550 && this.fx <= 0.5){
                    this.speedX = config.sx;
                    this.speedY = 0;
                }
                if(this.mX >= 650 && this.fx <= 0.5){
                    this.fx=0.8;
                }
                if(this.mX <= 550 && this.fx > 0.5){
                    this.fx=0.4;
                }
                if(this.mX >= 650 && this.fx > 0.5){
                    this.speedX = -config.sx;
                    this.speedY = 0;
                }
            }

            if ((this.mY > lj_box.height - config.lj_height / 2) ||
                ((this.mX > lj_box.width - config.lj_width / 2) && this.fx) ||
                (this.fx > 0.5 && (this.mX < -config.lj_width / 2)) ||
                (config.level == 3 && (Math.abs(this.mX - lj_box.width / 2) < config.lj_width && Math.abs(this.mY - lj_box.height /
                    2) < config.lj_height))
            ) {
                this.stopMove();
                this.p1.remove();
                config.total_wrong += 1;
                $('.wrong').html('Failures: ' + config.total_wrong);
                if (config.total_wrong == 5) {
                    stopGame();
                    let imgList = setXX(config.point, config.total_point);
                    localStorage.setItem('p' + config.level, imgList);
                    let imgtext = '';
                    imgList.forEach(ii => {
                        imgtext += '<img src="' + ii + '"/>';
                    });
                    $('.fail-box').html(
                        `
                        <h2>Game Over</h2>
                        <p>Your score this time is: ${config.point}</p>
                        <div>${imgtext}</div>
                        <button type="button" onclick="location.reload()">Return</button>
                        `
                    );
                    $('.fail-box').css({
                        display: 'flex'
                    });
                }
            }
            $(this.p1).css({
                left: this.mX,
                top: this.mY,
            });
        }, 100);
    };
    this.stopMove = function() {
        clearInterval(this.timer);
        console.log(this.timer);
    };
    this.create = function() {
        this.p1 = document.createElement('div');
        $(this.p1).css({
            width: config.lj_width,
            height: config.lj_height,
            background: `url(${img}) no-repeat center center`,
            backgroundSize: 'contain',
            position: 'absolute',
            left: this.mX,
            top: this.mY,
            zIndex: 1000
        });
        this.lineMove();
        $('.lj-box').append(this.p1);
        this.p1.addEventListener('mousemove', this.drag, false);
        this.p1.addEventListener('mouseleave', this.dragEnd, false);
        this.p1.addEventListener('mouseup', this.dragEnd, false);
        this.p1.addEventListener('mousedown', this.dragStart, false);
    };
    this.drag = function(e) {
        console.log(that.flag);
        if (that.flag == 1) {
            let x1 = document.getElementsByClassName('container')[0].offsetLeft + this.parentNode.offsetLeft;
            let y1 = document.getElementsByClassName('container')[0].offsetTop + this.parentNode.offsetTop;
            let moveX = e.clientX - this.offsetLeft - x1 - config.lj_width / 2;
            let moveY = e.clientY - this.offsetTop - y1 - config.lj_height / 2;
            that.mX = that.mX + moveX;
            that.mY = that.mY + moveY;
            $(this).css({
                left: that.mX,
                top: that.mY
            });
        }
    };
    this.dragStart = function() {
        that.flag = 1;
        that.dragX = that.mX;
        that.dragY = that.mY;
        console.log(that.flag);
        that.stopMove();
        $(this).css({
            zIndex: 100000
        });
    };
    this.dragEnd = function() {
        if (that.flag == 0) {
            return;
        }
        $(this).css({
            zIndex: 0
        });
        console.log('stop');
        that.flag = 0;
        if(config.level == 1){
            console.log(that.mY);
            if(that.mY < 0){
                that.mY = that.dragY;
            }
        } else if(config.level == 2){
            console.log(that.mY);
            if(that.mY < 0 || that.mY > 160){
                that.mY = that.dragY;
            }
        } else if(config.level == 3){
            that.mX = that.dragX;
            that.mY = that.dragY;
        }
        let mx = this.parentNode.offsetLeft + this.offsetLeft;
        let my = this.parentNode.offsetTop + this.offsetTop;
        let arr = [ljt1, ljt2, ljt3, ljt4];
        for (let i = 0; i < arr.length; i++) {
            if (Math.abs(arr[i].a.offsetLeft - mx) < 150 && Math.abs(arr[i].a.offsetTop - my) < 170) {
                if (arr[i].type != that.type) {
                    $(arr[i].a).css({
                        backgroundColor: 'red'
                    });
                    setTimeout(() => {
                        $(arr[i].a).css({
                            backgroundColor: ''
                        });
                    }, 200);
                    if (config.level == 2) {
                        if (that.fx > 0.5) {
                            that.speedX = -config.sx;
                        } else {
                            that.speedX = config.sx;
                        }
                        that.speedY = 0;
                    }
                    that.mX = that.startX;
                    that.mY = that.startY;
                    $(this).css({
                        left: that.startX,
                        top: that.startY
                    });
                    that.lineMove();
                    break;
                } else {
                    $(arr[i].a).css({
                        backgroundColor: 'yellow'
                    });
                    setTimeout(() => {
                        $(arr[i].a).css({
                            backgroundColor: ''
                        });
                    }, 200);
                    config.point += 1;
                    $('.point').html('Score: ' + config.point);
                    this.remove();
                    that.stopMove();
                    break;
                }
            } else {
                that.lineMove();
                $(this).css({
                    left: that.mX,
                    top: that.mY
                });
            }
        }
    };
}


function Ljt(left, top, type) {
    this.left = left;
    this.top = top;
    this.type = type;
    this.a = null;
    this.create = function() {
        let img_list = ['./img/1.png', './img/2.png', './img/3.png', './img/4.png'];
        this.a = document.createElement('div');
        $(this.a).css({
            left: this.left,
            top: this.top,
            width: 150,  // Set the desired width
            height: 170, // Set the desired height
            position: 'absolute',
            backgroundImage: `url(${img_list[this.type - 1]})`,
            backgroundSize: 'contain', // Ensure the image fits within the container
            backgroundPosition: 'center', // Center the image within the container
            backgroundRepeat: 'no-repeat', // Prevent repeating the image
            border: '1px solid #000' // Optional: Add a border to visualize the container
        });
        $('.game-cont').append(this.a);
    };
}


const all_lj = [
    // Kitchen Waste
    [
        './img/cy/1.png', './img/cy/2.png', './img/cy/3.png', './img/cy/4.png',
        './img/cy/5.png', './img/cy/6.png', './img/cy/7.png', './img/cy/8.png',
        './img/cy/9.png', './img/cy/10.png', './img/cy/11.png', './img/cy/12.png',
        './img/cy/13.png', './img/cy/14.png', './img/cy/15.png', './img/cy/16.png',
        './img/cy/17.png', './img/cy/18.png', './img/cy/19.png', './img/cy/20.png',
        './img/cy/21.png', './img/cy/22.png', './img/cy/23.png', './img/cy/24.png',
        './img/cy/25.png',
    ],
    // Unrecyclable Waste
    [
        './img/bkhs/1.png', './img/bkhs/2.png', './img/bkhs/3.png', './img/bkhs/4.png', './img/bkhs/5.png',
        './img/bkhs/6.png', './img/bkhs/7.png', './img/bkhs/8.png', './img/bkhs/9.png', './img/bkhs/10.png',
        './img/bkhs/11.png', './img/bkhs/12.png', './img/bkhs/13.png', './img/bkhs/14.png', './img/bkhs/15.png',
        './img/bkhs/16.png', './img/bkhs/17.png', './img/bkhs/18.png', './img/bkhs/19.png', './img/bkhs/20.png',
        './img/bkhs/21.png', './img/bkhs/22.png', './img/bkhs/23.png', './img/bkhs/24.png', './img/bkhs/25.png'
    ],
    // Hazardous Waste
    [
        './img/yh/1.png', './img/yh/2.png', './img/yh/3.png', './img/yh/4.png', './img/yh/5.png',
        './img/yh/6.png', './img/yh/7.png', './img/yh/8.png', './img/yh/9.png', './img/yh/10.png',
        './img/yh/11.png', './img/yh/12.png', './img/yh/13.png', './img/yh/14.png', './img/yh/3.png',
        './img/yh/3.png', './img/yh/3.png', './img/yh/3.png', './img/yh/3.png', './img/yh/3.png',
        './img/yh/3.png', './img/yh/3.png', './img/yh/3.png', './img/yh/3.png', './img/yh/3.png'
    ],
    // Recyclable Waste
    [
        './img/khs/1.png', './img/khs/2.png', './img/khs/3.png', './img/khs/4.png', './img/khs/5.png',
        './img/khs/6.png', './img/khs/7.png', './img/khs/8.png', './img/khs/9.png', './img/khs/10.png',
        './img/khs/11.png', './img/khs/12.png', './img/khs/13.png', './img/khs/14.png', './img/khs/15.png',
        './img/khs/16.png', './img/khs/17.png', './img/khs/18.png', './img/khs/19.png', './img/khs/20.png',
        './img/khs/21.png', './img/khs/22.png', './img/khs/23.png', './img/khs/24.png', './img/khs/25.png',
    ]
];
let lj_obj = [];
let timeout_obj = [];

function doCreate(level) {
    let will_show = [];
    if (level == 1) {
        will_show = all_lj.map((item) => {
            return item.slice(0, 15);
        });
    } else if (level == 2) {
        will_show = all_lj.map((item) => {
            return item.slice(15);
        });
    } else {
        will_show = all_lj;
    }
    will_show.forEach((wai, i) => {
        wai.sort(function() {
            return .5 - Math.random();
        });
        wai.forEach((item, j) => {
            let timeout = setTimeout(function() {
                let alj = new CreateLJ(i + 1, item);
                lj_obj.push(alj);
                alj.create();
            }, config.s1 * j + config.s2 * i);
            timeout_obj.push({
                timer: timeout,
                i: i,
                j: j,
                obj: item
            });
        });
    });
}

function stopGame() {
    lj_obj.forEach(item => {
        item.stopMove();
    });
    timeout_obj.forEach(item => {
        clearTimeout(item.timer);
    });
    _time.endInterval();
    $('.bar').addClass('hides');
    $('.stop-btn').html('<span onclick="reStart()"><img src="./img/start.png"/></span>');
}

function reStart() {
    lj_obj.forEach(item => {
        item.lineMove();
    });
    timeout_obj.forEach(item => {
        item.timer = setTimeout(function() {
            let alj = new CreateLJ(item.i + 1, item.obj);
            lj_obj.push(alj);
            alj.create();
        }, config.s1 * item.j + config.s2 * item.i);
    });
    _time.startInterval();
    $('.bar').removeClass('hides');
    $('.stop-btn').html('<span onclick="stopGame()"><img src="./img/stop.png"/></span>');
}
let ljt1, ljt2, ljt3, ljt4;
let bgm = document.getElementById('bgm');
let bgm_flag = 0;

function bgmSound() {
    if (bgm_flag == 1) {
        bgm.pause();
        bgm_flag = 0;
    } else {
        bgm.play();
        bgm_flag = 1;
    }
}

function init(level) {
    $('.game-cont').css({
        display: 'block'
    });
    if (level == 1) {
        ljt1 = new Ljt(100, 100, 1);
        ljt1.create();
        ljt2 = new Ljt(400, 100, 2);
        ljt2.create();
        ljt3 = new Ljt(700, 100, 3);
        ljt3.create();
        ljt4 = new Ljt(1000, 100, 4);
        ljt4.create();
        config.sx = 2;
        config.s1 = 9000;
        config.s2 = 3000;
        config.sy = 0;
        config.level = 1;
        config.total_point = 60;
        lj_box.height = 300;
        lj_box.dbimg = 'url(img/db.jpg)';
    } else if (level == 2) {
        ljt1 = new Ljt(20, 40, 1);
        ljt1.create();
        ljt2 = new Ljt(1000, 40, 2);
        ljt2.create();
        ljt3 = new Ljt(20, 500, 3);
        ljt3.create();
        ljt4 = new Ljt(1000, 500, 4);
        ljt4.create();
        config.sx = 2;
        config.sy = 0;
        config.s1 = 10000;
        config.s2 = 2000;
        _time.total = 150;
        config.level = 2;
        lj_box.height = 480;
        config.total_point = 75;
        lj_box.dbimg = 'url(img/db2.png)';
    } else if (level == 3) {
        ljt1 = new Ljt(550, 20, 1);
        ljt1.create();
        ljt2 = new Ljt(20, 250, 2);
        ljt2.create();
        ljt3 = new Ljt(550, 500, 3);
        ljt3.create();
        ljt4 = new Ljt(1000, 250, 4);
        ljt4.create();
        config.sx = 1.3;
        config.sy = 0.75;
        config.s1 = 8000;
        config.s2 = 2000;
        _time.total = 180;
        config.level = 3;
        config.total_point = 100;
        lj_box.height = 750;
        lj_box.dbimg = 'url(img/db3.png)';
    }
    doCreate(level);
    lj_box.setPos();
    _time.startInterval();
    bgm.play();
    bgm_flag = 1;
}
