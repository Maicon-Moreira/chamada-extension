chrome.extension.sendMessage({}, (response) => {
  const readyStateCheckInterval = setInterval(() => {
    if (document.readyState === 'complete') {
      clearInterval(readyStateCheckInterval);

      let studentsNames = [
        'maicon moreira',
        'dominick santos brasileiro',
        'natalia narloch',
        'carolina teixeira',
        'thuany de souza',
        'victor jaraceski',
        'edna thayna',
        'tainara rocha',
        'josé pedro',
      ];
      studentsNames = studentsNames.map((name) => name.toLowerCase());
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
            const chatPositions = document.querySelector('.mKBhCf.qwU8Me.RlceJe.kjZr4')
              .getBoundingClientRect();

            const fullTopBarCorrectX = chatPositions.x - fullTopBarPositions.width;

            fullTopBar.children[0].classList.remove('eLNT1d');
            fullTopBar.classList.add('float-right');

            fullTopBar.style.left = `${fullTopBarCorrectX}px`;
          }
          if (!isChatOpen) {
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
                const newTab = window.open();

                const presents = calledNames;
                const notPresents = studentsNames.filter((name) => !presents.includes(name));

                const content = [];

                content.push('<b>AUSENTES:</b><br>');
                notPresents.forEach((name) => content.push(name.toUpperCase()));

                content.push('<br><b>PRESENTES:</b><br>');
                presents.forEach((name) => content.push(name.toUpperCase()));

                const html = `
                <html lang="pt-BR">
                    <head>
                        <title>CHAMADA</title>
                    </head>
                    <body>
                        ${content.join('<br>')}
                    </body>
                </html
                `;


                newTab.document.write(html);
                // newTab.document.write(content.join('<br>'));
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
