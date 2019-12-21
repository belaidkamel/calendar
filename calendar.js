
//Classe Calendrier
class Calendar {
	constructor(domTarget) {
		try {
			this.domElement = document.querySelector(domTarget);
			// erreur 
			if (!this.domElement) throw "Calendar - L'élément spécifié est introuvable";
		} catch (e) {
			document.getElementById('stateCalendar').innerHTML = "Error: " + e.message + ".";
		}
		this.monthList = new Array('janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'décembre');
		this.dayList = new Array('lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche');
		this.today = new Date();
		this.today.setHours(0, 0, 0, 0);
		this.currentMonth = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
		//le div l'entéte de notre calendrier
		let entete = document.createElement('div');
		entete.classList.add('entete');
		this.domElement.appendChild(entete);
		//le div les jours
		this.content = document.createElement('div');
		this.domElement.appendChild(this.content);
		//le div les jours feriés
		let contentSpec = document.createElement('div');
		contentSpec.classList.add("contentSpec");
		contentSpec.setAttribute("id", "contentSpec");
		contentSpec.textContent = ""
		this.domElement.appendChild(contentSpec);
		//"précédent"
		let previousButton = document.createElement('button');
		previousButton.setAttribute('data-action', '-1');
		previousButton.textContent = '<';
		entete.appendChild(previousButton);
		//le div le mois/année
		this.monthDiv = document.createElement('div');
		this.monthDiv.classList.add('month');
		entete.appendChild(this.monthDiv);
		//"suivant"
		let nextButton = document.createElement('button');
		nextButton.setAttribute('data-action', '1');
		nextButton.textContent = '>';
		entete.appendChild(nextButton);
		this.domElement.querySelectorAll('button').forEach(element => {
			element.addEventListener('click', () => {
				this.currentMonth.setMonth(this.currentMonth.getMonth() * 1 + element.getAttribute('data-action') * 1);
				this.loadMonth(this.currentMonth);
			});
		});
		this.loadMonth(this.currentMonth);
		var daySelectedAuto = this.today.getDate() + "/" + (this.today.getMonth() + 1) + "/" + this.today.getFullYear();
		this.meeting(daySelectedAuto);
	}
	loadMonth(date) {
		function JoursFeries(dateferies) {
			var joursFerie = "aucun";
			var arrayJoursferies = new Array("1/1", "1/5", "8/5", "14/7", "15/8", "1/11", "11/11", "25/12");// j'ai juste ajouté 8 jours (il y a 19 jours)
			for (var i = 0; i < arrayJoursferies.length; i++) {
				if (dateferies == arrayJoursferies[i] && i == 0) {
					joursFerie = "Jour de l'AN";
				} else if (dateferies == arrayJoursferies[i] && i == 1) {
					joursFerie = "Fête de travail";
				} else if (dateferies == arrayJoursferies[i] && i == 2) {
					joursFerie = "Fête de la victoire";
				} else if (dateferies == arrayJoursferies[i] && i == 3) {
					joursFerie = "Fête nationale";
				} else if (dateferies == arrayJoursferies[i] && i == 4) {
					joursFerie = "Assompton";
				} else if (dateferies == arrayJoursferies[i] && i == 5) {
					joursFerie = "Toussaint";
				} else if (dateferies == arrayJoursferies[i] && i == 6) {
					joursFerie = "Armistice";
				} else if (dateferies == arrayJoursferies[i] && i == 7) {
					joursFerie = "Noël";
				}
			}
			return joursFerie;
		}
		this.content.textContent = '';
		this.monthDiv.textContent = this.monthList[date.getMonth()].toUpperCase() + ' ' + date.getFullYear();
		for (let i = 0; i < this.dayList.length; i++) {
			let cell = document.createElement('span');
			cell.classList.add('cell');
			cell.classList.add('day');
			cell.textContent = this.dayList[i].substring(0, 3).toUpperCase();
			if (cell.textContent === 'SAM' || cell.textContent === 'DIM') {
				cell.style.color = "#b4d8ee";
			} else
				cell.style.color = "none";
			this.content.appendChild(cell);
		}
		let monthLength = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
		var nbCellEmpty = date.getDay();
		if (date.getDay() === 0) {
			nbCellEmpty = 7;
		}
		for (let i = 1; i <= (nbCellEmpty - 1); i++) {
			let cel = document.createElement('span');
			cel.classList.add('cell');
			cel.classList.add('empty');
			this.content.appendChild(cel);
		}
		for (let i = 1; i <= monthLength + 1; i++) {
			var newDate = new Date(date.getFullYear(), date.getMonth(), i);
			var dayMark = document.createElement('span');
			var nbRendezVous = 0;
			var cheekJourFeries = 0;
			dayMark.classList.add("dayMark");
			dayMark.setAttribute("id", "dayMark");
			dayMark.setAttribute("value", -1);
			let cel = document.createElement('button');
			cel.classList.add('cell');
			if (i == (monthLength + 1)) {
				cel = document.createElement('span');
				cel.classList.add('empty');
				cel.textContent = "";
				cel.setAttribute("value", 0);
			} else {
				cel.textContent = i;
				cel.value = i;
				cel.setAttribute("value", i);
				cheekJourFeries = i + "/" + (this.currentMonth.getMonth() + 1);
			}
			var celToday = this.today.getDate() + "/" + this.today.getMonth();
			var celSelect = newDate.getDate() + "/" + newDate.getMonth();
			//style css des weekend
			if (newDate.getDay() == 0 || newDate.getDay() == 6) {
				if (((newDate.getDay() - 1) != this.today.getDay()) && celToday != celSelect) {
					cel.style.color = "red";
					cel.style.background = "#183133";
				}
			}
			var markMeeting = localStorage.getItem(i + "/" + (this.currentMonth.getMonth() + 1) + "/" + this.currentMonth.getFullYear() + "-" + 1);
			//marquer jour férier
			if (JoursFeries(cheekJourFeries) != "aucun") {
				dayMark.textContent = ".";
				this.content.appendChild(cel).appendChild(dayMark);
			} //marquer jour du rdv
			else if (markMeeting) {
				dayMark.classList.add("dayMark1");
				dayMark.textContent = ".";
				this.content.appendChild(cel).appendChild(dayMark);
			} else
				this.content.appendChild(cel);
			let timestamp = new Date(date.getFullYear(), date.getMonth(), i).getTime();
			if (timestamp === this.today.getTime()) {
				cel.classList.add('today');
				document.getElementById("contentSpec").innerHTML = JoursFeries(timestamp);
			}
		}
		this.content.querySelectorAll('button').forEach(element => {
			element.addEventListener('click', (e) => {
				let targetCheek = e.target.value == null ? e.target.parentElement.value : e.target.value;
				let jourSelectione = targetCheek + "/" + (this.currentMonth.getMonth() + 1);
				document.getElementById("contentSpec").innerHTML = JoursFeries(jourSelectione);
				jourSelectione += "/" + this.currentMonth.getFullYear();
				let myNode = document.getElementById("meetings");
				if (myNode.hasChildNodes) {
					while (myNode.firstChild) {
						myNode.removeChild(myNode.firstChild);
					}
				}
				this.meeting(jourSelectione);
			});
		});
	}
	meeting(daySelectedAuto) {
		console.log("date d'entrée: " + daySelectedAuto);
		const nbMeetings = 1;
		daySelectedAuto += "-" + nbMeetings;
		console.log("date d'entrée + rendez vous: " + daySelectedAuto);
		let CountRendezVous = 1;
		if (typeof (Storage) !== "undefined") {
			while (CountRendezVous > 0 && CountRendezVous < 20) {
				let result = localStorage.getItem(daySelectedAuto);
				let saveMeeting = JSON.parse(result);
				if (saveMeeting == null) {
					console.log("valeur " + daySelectedAuto);
					let createMeeting = new Meeting(daySelectedAuto, "", "");
					CountRendezVous = 0;
					break;
				} else {
					let mettingSaved = new Meeting(daySelectedAuto, saveMeeting.titre, saveMeeting.description);
					console.log("deja enrgistrée : " + daySelectedAuto, "", "");
				}
				let idMeetings = daySelectedAuto.split('-');
				let dateID = idMeetings[0];
				idMeetings = idMeetings[1] != null ? idMeetings[1] : -1;
				console.log("date recupéré : " + dateID);
				console.log("nb rendez vous  : " + idMeetings);
				daySelectedAuto = dateID + "-" + (parseInt(idMeetings) + 1);
				CountRendezVous++;
			}
		}
	}
}
//Class Rendez vous
class Meeting {
	constructor(daySelected, titre, descriptions) {
		this.titre = titre;
		this.description = descriptions;
		this.meeting = document.getElementById("meetings");
		if (!this.meeting) throw "Meeting - Cette élément est indisponible";
		//la div pour la class rendez-vous
		let divRendezVous = document.createElement('div');
		divRendezVous.classList.add("divRendezVous");
		divRendezVous.setAttribute("id", "divRendezVous");
		this.meeting.appendChild(divRendezVous);
		//la div pour l'entéte de notre rendez-vous
		let enteteRendezVous = document.createElement('div');
		enteteRendezVous.classList.add('enteteRendezVous');
		enteteRendezVous.setAttribute("id", "enteteRendezVous");
		enteteRendezVous.textContent = "Rendez Vous";
		divRendezVous.appendChild(enteteRendezVous);
		//la div pour le rendez-vous
		this.contentMetting = document.createElement('div');
		this.contentMetting.classList.add('contentMeeting');
		divRendezVous.appendChild(this.contentMetting);
		//la div pour le label nom
		let contentLabelNom = document.createElement('div');
		contentLabelNom.classList.add('contentLabelNom');
		this.contentMetting.appendChild(contentLabelNom);
		//la div pour le button de soumission
		let contentButton = document.createElement('div');
		contentButton.classList.add('contentButton');
		divRendezVous.appendChild(contentButton);
		//le label du titre
		let namelabel = document.createTextNode("TITRE");
		contentLabelNom.appendChild(namelabel);
		//le titre du rendez-vous
		let name = document.createElement('input');
		name.classList.add("meeting_name");
		name.setAttribute("type", "text");
		name.setAttribute("placeholder", "Rendez vous");
		name.setAttribute("name", "Nom");
		name.value = this.titre;
		name.setAttribute("id", 'meeting_name');
		this.contentMetting.appendChild(name);
		//erreur en cas de case non remplie
		let errorContentTitre = document.createElement('span');
		errorContentTitre.classList.add("errorContentTitre");
		errorContentTitre.setAttribute("id", "errorContentTitre");
		errorContentTitre.textContent = "Erreur, Veuillez renseigner ce champ";
		this.contentMetting.appendChild(errorContentTitre);
		//la div le label description
		let contentLabelDescription = document.createElement('div');
		contentLabelDescription.classList.add('contentLabelDescription');
		this.contentMetting.appendChild(contentLabelDescription);
		//le label de la description
		var desc = document.createTextNode("DESCRIPTION");
		contentLabelDescription.appendChild(desc);
		//la description du rendez-vous
		let description = document.createElement('textarea');
		description.classList.add("description");
		description.setAttribute("id", "description");
		description.setAttribute("type", "text");
		description.setAttribute("rows", "5");
		description.value = this.description;
		description.setAttribute("name", "decription");
		description.setAttribute("placeholder", "Message...");
		this.contentMetting.appendChild(description);
		//erreur on cas de case non remplie
		let errorContentDesc = document.createElement('span');
		errorContentDesc.classList.add("errorContentDesc");
		errorContentDesc.setAttribute("id", "errorContentDesc");
		errorContentDesc.textContent = "Erreur, Veuillez renseigner la description du rendez vous";
		this.contentMetting.appendChild(errorContentDesc);
		//boutton "Sumission"
		let subButton = document.createElement('button');
		subButton.classList.add("sub_button");
		subButton.setAttribute("id", "subButton");
		subButton.setAttribute("value", "Soumettre");
		subButton.setAttribute('data-action', '1');
		subButton.textContent = 'Soumettre';
		contentButton.appendChild(subButton);
		//boutton suppression
		let supButton = document.createElement('button');
		supButton.classList.add("sup_button");
		supButton.setAttribute("id", "supButton");
		supButton.setAttribute("value", "supp");
		supButton.setAttribute('data-action', '1');
		supButton.textContent = 'supp';
		contentButton.appendChild(supButton);
		//afficher les rdv
		//desactiver les input et le button de soumissions
		if (this.description != "" && this.titre != "") {
			description.classList.remove("description");
			name.classList.remove("meeting_name");
			name.setAttribute("disabled", "true");
			description.setAttribute("disabled", "true");
			name.classList.add("desactiveInput");
			description.classList.add("desactiveInput");
			subButton.setAttribute("disabled", "true");
			subButton.classList.add("btnDesactive");
			//la suppression d'un rendez-vous
			supButton.addEventListener('click', function () {
				localStorage.removeItem(daySelected, JSON.stringify(this));
				location.reload();
			});

		}else{
			//sinon crée le rdv
			document.getElementById("subButton").classList.remove('desactiveInput');
			document.getElementById("subButton").classList.add('sub_button');
			let nbRendezVous = document.querySelectorAll(".divRendezVous");
			for(let i = 0; i < nbRendezVous.length; i++) {
				nbRendezVous[i].querySelector(".sub_button").addEventListener('click', (e) => {
					var rendezVousContenair = e.target.parentElement.parentElement;
					let inputTitle = rendezVousContenair.querySelector('.meeting_name').value;
					let inputDescription = rendezVousContenair.querySelector('.description').value;
					let isValidName = false;
					let isValidDescription = false;
					// verifie si les champ sont renseignés
					if (!inputTitle || (inputDescription && !inputTitle)) {
						rendezVousContenair.querySelector('.errorContentTitre').style.display = "block";
						rendezVousContenair.querySelector('.meeting_name').style.boxShadow = " 0 0 3px #CC0000";
						isValidName = false;
					} else {
						rendezVousContenair.querySelector('.errorContentTitre').style.display = "none";
						rendezVousContenair.querySelector('.meeting_name').style.boxShadow = "none";
						isValidName = true;
					}
					if (!inputDescription || (inputTitle && !inputDescription)) {
						rendezVousContenair.querySelector('.errorContentDesc').style.display = "block";
						rendezVousContenair.querySelector('.description').style.boxShadow = " 0 0 3px #CC0000";
						isValidDescription = false;
					} else {
						rendezVousContenair.querySelector('.errorContentDesc').style.display = "none";
						rendezVousContenair.querySelector('.description').style.boxShadow = "none";
						isValidDescription = true;
					}
					if (typeof (Storage) !== "undefined" && isValidName && isValidDescription) {
						this.titre = inputTitle;
						this.description = inputDescription;
						try {
							if (localStorage.getItem(daySelected) == null) {
								//sauvegarde les données
								localStorage.setItem(daySelected, JSON.stringify(this));
							}  
							location.reload();
						} catch (e) {
							console.log(e);
						}
					}
				});
			}
		}
	}
}
const calendar = new Calendar('#calendar');

