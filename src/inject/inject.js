// chrome.extension.sendMessage({}, (response) => {
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
      ['edna thayna', 'A'],
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
              const notPresents = studentsNames.filter((name) => !presents.includes(name[0]));

              const content = [];

              content.push('NÃO PRESENTES:<br>');
              notPresents.forEach((name) => content.push(name[0].toUpperCase()));

              content.push('<br>PRESENTES:<br>');
              presents.forEach((name) => content.push(name[0].toUpperCase()));

              newTab.document.write(content.join('<br>'));
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
                  if (!calledNames.includes(name)) {
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
// });
