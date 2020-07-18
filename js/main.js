(() => {

    let yOffset = 0; //window.pageYOffset 대신 사용
    let prevScrollHeight = 0; //현재 스크롤 위치보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
    let currentScene = 0; //현재 활성화된 씬(눈으로 보고 있는 씬)
    let isNewScene = false; //새로운 씬이 시작된 순간 true로 변경

    const sceneInfo = [
        {
            type: 'sticky',
            heightNumber: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-0'),
                messageA: document.querySelector('#scroll-section-0 .main-message.a'),
                messageB: document.querySelector('#scroll-section-0 .main-message.b'),
                messageC: document.querySelector('#scroll-section-0 .main-message.c'),
                messageD: document.querySelector('#scroll-section-0 .main-message.d'),
                messageE: document.querySelector('#scroll-section-0 .main-message.e'),
                messageF: document.querySelector('#scroll-section-0 .main-message.f'),
                messageG: document.querySelector('#scroll-section-0 .main-message.g')
            },
            values: {
                messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }], //10% ~ 20% Animation
                messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }], //30% ~ 40% Animation
                messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
            }
        },
        {
            type: 'normal',
            heightNumber: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-1')
            }
        },
        {
            type: 'sticky',
            heightNumber: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-2')
            }
        },
        {
            type: 'sticky',
            heightNumber: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-3')
            }
        },
    ];

    function setLayout() {
        for (let i = 0; i < sceneInfo.length; i++) {
            sceneInfo[i].scrollHeight = sceneInfo[i].heightNumber * window.innerHeight;
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
        }

        yOffset = window.pageYOffset;
        let totalScrollHeight = 0;
        for (let i = 0; i < sceneInfo.length; i++) {
            totalScrollHeight += sceneInfo[i].scrollHeight;
            if (totalScrollHeight >= yOffset) {
                currentScene = i;
                break;
            }
        }
        setCurrentScene();
    }

    function setCurrentScene() {
        document.body.setAttribute('id', `show-scene-${currentScene}`);
    }

    function scrollLoop() {
        isNewScene = false;
        prevScrollHeight = 0;
        for (let i = 0; i < currentScene; i++) {
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }

        if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
            isNewScene = true;
            currentScene++;
            setCurrentScene();
        }

        if (yOffset < prevScrollHeight && currentScene !== 0) {
            isNewScene = true;
            currentScene--;
            setCurrentScene();
        }

        if (isNewScene) return;
        playAnimation();
    }

    function playAnimation() {
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        const currentYOffset = yOffset - prevScrollHeight;
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight;
        
        switch (currentScene) {
            case 0:
                let messageA_opacity_in = calcValues(values.messageA_opacity_in, currentYOffset);
                let messageA_opacity_out = calcValues(values.messageA_opacity_out, currentYOffset);

                objs.messageA.style.opacity = scrollRatio <= 0.22 ? messageA_opacity_in : messageA_opacity_out;
                break;
            case 1:
                break;
            case 3:
                break;
        }
    }

    function calcValues(values, currentYOffset) {
        let result;
        //현재 스크롤 섹션에서 스크롤된 범위의 비율
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight

        if (values.length === 3) {
            //start ~ end 사이에 애니메이션 실행
            const partScrollStart = values[2].start * scrollHeight;
            const partScrollEnd = values[2].end * scrollHeight;
            const partScrollHeight = partScrollEnd - partScrollStart;

            if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
                result = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
            } else if (currentYOffset < partScrollStart) {
                result = values[0];
            } else if (currentYOffset > partScrollEnd) {
                result = values[1];
            }
        } else {
            result = scrollRatio * (values[1] - values[0]) + values[0];
        }
        return result;
    }

    window.addEventListener('scroll', () => {
        yOffset = window.pageYOffset;
        scrollLoop();
    });
    window.addEventListener('load', setLayout);
    window.addEventListener('resize', setLayout);
})();