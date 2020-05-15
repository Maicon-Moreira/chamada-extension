chrome.extension.sendMessage({}, function (response) {
	var readyStateCheckInterval = setInterval(function () {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);

			console.log("Extensão inicializada");

			let studentsNames = [
				'você',
				'maicon moreira',
				'dominick brasileiro',
				'natalia narloch',
				'carolina teixeira',
				'thuany de souza',
				'victor jaraceski',
				'edna thayna',
				'tainara rocha',
				'josé pedro'
			]
			studentsNames = studentsNames.map(name => name.toLowerCase()) // so pra garantir
			const totalStudents = studentsNames.length

			let calledNames = []

			let mainPage = false
			let buttonInjected = false
			let buttonText = 'Clique para iniciar chamada'
			let inCall = false

			const button = document.createElement('div')
			const span = document.createElement('span')

			let mainLoop = setInterval(() => {

				if (!mainPage) {
					if (document.getElementById('lcsclient'))
						mainPage = true
					// console.log('Pagina inicial')
				}

				if (mainPage) {
					// console.log('Pagina principal')

					const isChatOpen = !!document.querySelectorAll(".z38b6.CnDs7d.hPqowe")[0]

					if (isChatOpen) {
						const fullTopBar = document.getElementsByClassName('Jrb8ue')[0]
						const fullTopBarPositions = fullTopBar.getBoundingClientRect()
						const chatPositions = document.querySelector('.mKBhCf.qwU8Me.RlceJe.kjZr4').getBoundingClientRect()

						const fullTopBarCorrectX = chatPositions.x - fullTopBarPositions.width

						fullTopBar.children[0].classList.remove('eLNT1d')
						fullTopBar.classList.add('float-right')

						fullTopBar.style.left = fullTopBarCorrectX + 'px'
					}
					if (!isChatOpen) {
						const fullTopBar = document.getElementsByClassName('Jrb8ue')[0]

						fullTopBar.classList.remove('float-right')
					}

					if (!buttonInjected) {
						const topBar = document.getElementsByClassName('NzPR9b')[0]

						topBar.style.borderRadius = '8px'

						span.innerText = buttonText
						button.id = "callButton"
						span.id = "callSpan"

						button.onclick = () => {
							if (!inCall) {
								inCall = true
							}
							else if (inCall) {
								inCall = false

								const newTab = window.open()

								const presents = calledNames
								const notPresents = studentsNames.filter(name => presents.indexOf(name) == -1)

								let string = ''

								string += 'NÃO PRESENTES:<br><br>'
								notPresents.forEach(name => string += `${name.toUpperCase()}<br>`)

								string += '<br><br>PRESENTES:<br><br>'
								presents.forEach(name => string += `${name.toUpperCase()}<br>`)

								newTab.document.write(string)
							}
						}

						button.append(span)
						topBar.prepend(button)

						buttonInjected = true
					}
					if (buttonInjected) {
						if (inCall) {
							if (!isChatOpen) {
								buttonText = "<span style='color:red'>IMPOSSÍVEL REALIZAR CHAMADA COM O CHAT FECHADO !"
							}
							if (isChatOpen) {
								buttonText = `Realizando chamada (${calledNames.length} de ${totalStudents}). Clique para finalizar.`

								const messages = document.querySelectorAll('.GDhqjd')
								messages.forEach(message => {
									const name = message.children[0].children[0].innerText.toLowerCase()
									const text = message.children[1].innerText.toLowerCase()

									if (text.match(/a|b|c/gm)) {
										if (calledNames.indexOf(name) == -1) {
											calledNames.push(name)
											console.log(name, 'chamado')
										}
									}
								})
							}
						}
						else {
							buttonText = 'Clique para iniciar chamada'
						}

						span.innerHTML = buttonText
					}
				}
			})
		}
	}, 10);
});