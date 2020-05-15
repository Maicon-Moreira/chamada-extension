function renderNotPresentStudents(students) {
    students.sort((a, b) => {
        if (a[1] > b[1]) {
            return 1;
        }

        if (a[1] < b[1]) {
            return -1;
        }

        return 0;
    });

    return students.reduce((acc, [name, group]) => `
        ${acc}
        <div class="student">
            <div class="name">${name.toUpperCase()}</div>
            <div class="group">${group ? `3${group}` : ''}</div>
        </div>
    `, '');
}

function renderPresentStudents(students, studentNames) {
    const studentsWithGroup = students.map(((student) => {
        const studentWithGroup = studentNames.find(([name]) => name === student);

        if (studentWithGroup) return studentWithGroup;
        return student;
    }));

    studentsWithGroup.sort((a, b) => {
        if (typeof a !== 'object') return 1;
        if (typeof b !== 'object') return -1;

        if (a[1] > b[1]) {
            return 1;
        }

        if (a[1] < b[1]) {
            return -1;
        }

        return 0;
    });

    return studentsWithGroup.reduce((acc, student) => {
        const name = typeof student === 'object' ? student[0] : student;
        const group = typeof student === 'object' ? student[1] : '';

        return `
        ${acc}
        <div class="student">
            <div class="name">${name.toUpperCase()}</div>
            <div class="group">${group ? `3${group}` : ''}</div>
        </div>
    `;
    }, '');
}

chrome.extension.sendMessage({}, () => {
    const readyStateCheckInterval = setInterval(() => {
        if (document.readyState === 'complete') {
            clearInterval(readyStateCheckInterval);


            let studentsNames = [
                ['maicon moreira', 'C'],
                ['dominick brasileiro', 'A'],
                ['natalia narloch', 'C'],
                ['carolina teixeira', 'C'],
                ['thuany de souza', 'A'],
                ['victor jaraceski', 'A'],
                ['edna thayna', 'B'],
                ['tainara rocha', 'A'],
                ['josé pedro', 'C'],
            ];

            studentsNames = studentsNames.map(([name, group]) => [name.toLowerCase(), group]);

            const totalStudents = studentsNames.length;

            const calledNames = [];

            let mainPage = false;
            let buttonInjected = false;
            let buttonText = 'Clique para iniciar chamada';
            let inCalling = false;

            const button = document.createElement('div');
            const span = document.createElement('span');
            button.style.cursor = 'pointer';

            setInterval(() => {
                if (!mainPage) {
                    if (document.getElementById('lcsclient')) mainPage = true;
                }

                if (mainPage) {
                    const isChatOpen = !!document.querySelector('.z38b6.CnDs7d.hPqowe');

                    if (isChatOpen) {
                        const fullTopBar = document.querySelector('.Jrb8ue');
                        const fullTopBarPositions = fullTopBar.getBoundingClientRect();

                        // property 'getBoundingClientRect' of null error fix
                        const chat = document.querySelector('.mKBhCf.qwU8Me.RlceJe.kjZr4');
                        if (chat) {
                            const chatPositions = chat ? chat.getBoundingClientRect() : null;

                            const fullTopBarCorrectX = chatPositions.x - fullTopBarPositions.width;

                            fullTopBar.children[0].classList.remove('eLNT1d');
                            fullTopBar.classList.add('float-right');

                            fullTopBar.style.left = `${fullTopBarCorrectX}px`;
                        }
                    } else {
                        const fullTopBar = document.getElementsByClassName('Jrb8ue')[0];

                        fullTopBar.classList.remove('float-right');
                    }

                    if (!buttonInjected) {
                        const topBar = document.getElementsByClassName('NzPR9b')[0];

                        topBar.style.borderRadius = '8px';

                        span.innerText = buttonText;
                        button.id = 'callButton';
                        span.id = 'callSpan';

                        button.onclick = () => {
                            inCalling = !inCalling;

                            if (!inCalling) {
                                const presents = calledNames;
                                const notPresents = studentsNames.filter(([name]) => !presents.includes(name));

                                presents.sort();
                                notPresents.sort();

                                const html = document.createElement('html');
                                const head = document.createElement('head');

                                const title = document.createElement('title');
                                title.innerText = 'Chamada';

                                const body = document.createElement('body');

                                const content = `
                                    <div class="presents">
                                        <h2>Presentes:</h2>
                                        ${renderPresentStudents(presents, studentsNames)}
                                    </div>
                                    <div class="not-presents">
                                        <h2>Ausentes:</h2>
                                        ${renderNotPresentStudents(notPresents)}
                                    </div>
                                `;

                                const styles = document.createElement('style');

                                styles.innerHTML = `
                                    * {
                                        font-family: sans-serif;
                                    }
                            
                                    body {
                                        display: flex;
                                        justify-content: space-around;
                                    }
                            
                                    .student {
                                        margin: 12px 0;
                                    }
                            
                                    .name, .group {
                                        display: inline-block;
                                    }                        
                                `;

                                body.innerHTML = content;
                                head.appendChild(title);
                                head.appendChild(styles);
                                html.appendChild(head);
                                html.appendChild(body);

                                const tmp = document.createElement('div');
                                tmp.appendChild(html);

                                const newTab = window.open();
                                newTab.document.write(tmp.innerHTML);
                            }
                        };

                        button.append(span);
                        topBar.prepend(button);

                        buttonInjected = true;
                    }
                    if (buttonInjected) {
                        if (inCalling) {
                            if (!isChatOpen) {
                                buttonText = "<span style='color:red'>Por favor, abra o chat!</span>";
                            }
                            if (isChatOpen) {
                                buttonText = `Realizando chamada (${calledNames.length} de ${totalStudents}). Clique para finalizar.`;

                                const messages = document.querySelectorAll('.GDhqjd');
                                messages.forEach((message) => {
                                    const name = message.children[0].children[0].innerText.toLowerCase();
                                    const text = message.children[1].innerText.toLowerCase();

                                    if (text.match(/a|b|c/gm)) {
                                        if (!calledNames.includes(name) && name !== 'você' && name !== 'you') {
                                            calledNames.push(name);
                                        }
                                    }
                                });
                            }
                        } else {
                            buttonText = 'Clique para iniciar chamada';
                        }

                        span.innerHTML = buttonText;
                    }
                }
            });
        }
    }, 10);
});
