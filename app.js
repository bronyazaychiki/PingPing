// 初始化Vue实例
new Vue({
    el: '#app',
    data: {
        // 页面控制
        currentPage: 'start',
        // 关卡状态
        level1Passed: false,
        level2Passed: false,
        level3Passed: false,
        // 拼图相关
        puzzleProgress: 0,
        puzzlePieces: [],
        // 答题相关
        selectedOption: -1,
        quizTip: '',
        currentQuiz: {},
        // 接红包游戏
        catchCount: 0,
        gameInterval: null,
        // 金额统计
        totalAmount: 0,
        // 爱情故事配置（重点：替换成你们的真实故事！）
        story: {
            meetTime: '2023年夏天',
            meetPlace: '学校的咖啡店',
            meetImg: 'https://picsum.photos/500/300?random=1', // 替换成你们的合照
            heartTime: '2023年七夕',
            heartThing: '一起看了第一场烟花',
            heartImg: 'https://picsum.photos/500/300?random=2', // 替换成合照
            confessTime: '2023年国庆节',
            confessImg: 'https://picsum.photos/500/300?random=3' // 替换成合照
        },
        // 专属问题库
        quizList: [
            {
                question: '我们第一次约会吃的是什么？',
                options: ['火锅', '烤肉', '日料', '西餐'],
                answer: 1 // 正确答案索引
            },
            {
                question: '我送你的第一个礼物是？',
                options: ['项链', '小熊玩偶', '口红', '书籍'],
                answer: 2
            },
            {
                question: '你最喜欢我叫你什么昵称？',
                options: ['宝贝', '猪猪', '小仙女', '小可爱'],
                answer: 0
            }
        ]
    },
    mounted() {
        // 初始化音效
        this.initSounds();
        // 初始化答题
        this.currentQuiz = this.quizList[0];
        // 初始化烟花特效
        this.initFireworks();
    },
    methods: {
        // 页面跳转
        goToPage(page) {
            this.playSound('click');
            this.currentPage = page;
            
            // 初始化对应关卡
            if (page === 'level1') this.initPuzzle();
            if (page === 'level3') this.initCatchGame();
        },
        // 初始化音效
        initSounds() {
            this.sounds = {
                click: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3'] }),
                success: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3'] }),
                fail: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-negative-click-1107.mp3'] }),
                reward: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3'] })
            };
        },
        // 播放音效
        playSound(type) {
            if (this.sounds[type]) {
                this.sounds[type].play();
            }
        },
        // 初始化拼图
        initPuzzle() {
            const grid = this.$refs.puzzleGrid;
            grid.innerHTML = '';
            this.puzzleProgress = 0;
            
            // 生成9块拼图（用你们的合照替换图片地址）
            const imgUrl = this.story.meetImg;
            for (let i = 0; i < 9; i++) {
                const piece = document.createElement('div');
                piece.className = 'puzzle-piece';
                piece.style.backgroundImage = `url(${imgUrl})`;
                piece.style.backgroundPosition = `${-(i % 3) * 33.33}% ${-Math.floor(i / 3) * 33.33}%`;
                piece.dataset.index = i;
                
                // 随机打乱
                piece.style.order = Math.floor(Math.random() * 9);
                
                // 点击拼图
                piece.addEventListener('click', () => {
                    if (!piece.classList.contains('completed')) {
                        piece.classList.add('completed');
                        this.puzzleProgress++;
                        this.playSound('click');
                        
                        // 拼图完成
                        if (this.puzzleProgress === 9) {
                            this.playSound('success');
                            this.level1Passed = true;
                            this.totalAmount += 13.14;
                            setTimeout(() => {
                                this.playSound('reward');
                            }, 500);
                        }
                    }
                });
                
                grid.appendChild(piece);
            }
        },
        // 答题选择选项
        selectOption(idx) {
            this.selectedOption = idx;
            this.playSound('click');
            this.quizTip = '';
        },
        // 提交答题
        submitQuiz() {
            if (this.selectedOption === this.currentQuiz.answer) {
                this.playSound('success');
                this.quizTip = '✅ 答对啦！不愧是我的宝贝～';
                this.level2Passed = true;
                this.totalAmount += 52.00;
                setTimeout(() => {
                    this.playSound('reward');
                }, 500);
            } else {
                this.playSound('fail');
                this.quizTip = '❌ 答错啦，再想想～';
                this.selectedOption = -1;
            }
        },
        // 初始化接红包游戏
        initCatchGame() {
            const game = this.$refs.catchGame;
            game.innerHTML = '';
            this.catchCount = 0;
            
            // 创建玩家
            const player = document.createElement('div');
            player.className = 'game-player';
            player.innerHTML = '❤️';
            player.style.left = '50%';
            player.style.transform = 'translateX(-50%)';
            game.appendChild(player);
            
            // 键盘控制
            document.addEventListener('keydown', (e) => {
                const left = parseInt(player.style.left) || 50;
                if (e.key === 'ArrowLeft' && left > 0) {
                    player.style.left = `${left - 5}%`;
                }
                if (e.key === 'ArrowRight' && left < 90) {
                    player.style.left = `${left + 5}%`;
                }
            });
            
            // 生成红包
            if (this.gameInterval) clearInterval(this.gameInterval);
            this.gameInterval = setInterval(() => {
                if (this.catchCount >= 10) {
                    clearInterval(this.gameInterval);
                    this.level3Passed = true;
                    this.totalAmount += 99.99;
                    this.playSound('success');
                    setTimeout(() => {
                        this.playSound('reward');
                    }, 500);
                    return;
                }
                
                // 创建红包
                const packet = document.createElement('div');
                packet.className = 'game-packet';
                packet.innerHTML = '🧧';
                packet.style.left = `${Math.random() * 90}%`;
                packet.style.animationDuration = `${2 + Math.random() * 2}s`;
                
                // 红包下落
                game.appendChild(packet);
                
                // 检测碰撞
                const checkCollision = setInterval(() => {
                    const packetRect = packet.getBoundingClientRect();
                    const playerRect = player.getBoundingClientRect();
                    
                    // 碰撞检测
                    if (
                        packetRect.bottom >= playerRect.top &&
                        packetRect.left >= playerRect.left &&
                        packetRect.right <= playerRect.right
                    ) {
                        this.catchCount++;
                        this.playSound('success');
                        packet.remove();
                        clearInterval(checkCollision);
                    }
                    
                    // 红包落地
                    if (packetRect.bottom >= game.getBoundingClientRect().bottom) {
                        packet.remove();
                        clearInterval(checkCollision);
                    }
                }, 50);
            }, 800);
        },
        // 初始化烟花特效
        initFireworks() {
            // 简化版烟花特效（如需更炫酷可替换）
            const createFirework = () => {
                const fireworks = document.querySelector('.fireworks');
                if (!fireworks) return;
                
                const firework = document.createElement('div');
                firework.style.position = 'absolute';
                firework.style.width = '10px';
                firework.style.height = '10px';
                firework.style.borderRadius = '50%';
                firework.style.background = `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`;
                firework.style.left = `${Math.random()*100}%`;
                firework.style.top = `${Math.random()*100}%`;
                firework.style.animation = `firework 1.5s ease forwards`;
                
                fireworks.appendChild(firework);
                
                setTimeout(() => {
                    firework.remove();
                }, 1500);
            };
            
            // 添加烟花动画样式
            const style = document.createElement('style');
            style.innerHTML = `
                @keyframes firework {
                    0% { transform: scale(0); opacity: 1; }
                    50% { transform: scale(5); opacity: 0.8; }
                    100% { transform: scale(10); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
            
            // 定时生成烟花
            setInterval(createFirework, 1000);
        }
    },
    beforeDestroy() {
        if (this.gameInterval) clearInterval(this.gameInterval);
    }
});
