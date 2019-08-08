import { Component, OnInit } from '@angular/core';
import { Case, Player, Enemy } from './case.model';
import { SelectItem } from './components/selectitem';
import { BindingType } from '@angular/compiler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  widthMap: number;
  heightMap: number;

  widthMapArray: number[];
  heightMapArray: number[];

  cases: Case[];
  caseInWork: Case;

  btInWork: HTMLElement;

  types: SelectItem[];
  enemyTypes: SelectItem[];
  itemTypes: SelectItem[];

  ngOnInit(): void {
    this.heightMap = 5;
    this.widthMap = 5;
    this.cases = new Array();

    this.types = [
      { label: 'Vide', value: null },
      { label: 'Joueur', value: 'player' },
      { label: 'Ennemi', value: 'enemy' },
      { label: 'Sortie', value: 'exit' },
      { label: 'Obstacle', value: 'obstacle' },
      { label: 'Torche', value: 'torch' },
      { label: 'Objet', value: 'item' }
    ];

    this.enemyTypes = [
      { label: 'Loup-garou', value: 'werewolf' },
      { label: 'Zombie', value: 'zombie' }
    ];

    this.itemTypes = [
      { label: 'Torches', value: 'torch' },
      { label: 'Haches', value: 'axe' }
    ];
  }

  /**
   * sélection d'une case sur la carte
   * @param h position H du bouton
   * @param w position W du bouton
   */
  selectCase(h: number, w: number) {

    // Modif css ancien bouton
    if (this.btInWork !== undefined) {
      this.btInWork.setAttribute('class', 'bt-case');
    }

    // modif css du bouton en modification
    this.btInWork = document.getElementById(h + '/' + w);
    this.btInWork.setAttribute('class', 'bt-case-selected');

    // récupération de l'objet case
    this.caseInWork = this.cases.find(x => x.height === h && x.width === w);

    // Si la case n'existe pas on la crée et ajoute à la liste
    if (this.caseInWork === undefined) {
      this.caseInWork = new Case(h, w);
      this.cases.push(this.caseInWork);
    }
  }

  onTypeChange() {
    switch (this.caseInWork.type) {
      case null:
        this.btInWork.innerHTML = '&nbsp;';
        this.caseInWork.object = null;
        break;
      case 'player':
        this.btInWork.innerHTML = 'P';
        this.caseInWork.object = new Player(this.itemTypes);
        break;
      case 'enemy':
        this.btInWork.innerHTML = 'E';
        this.caseInWork.object = new Enemy();
        break;
      case 'exit':
        this.btInWork.innerHTML = 'E';
        this.caseInWork.object = null;
        break;
      case 'obstacle':
        this.btInWork.innerHTML = 'O';
        this.caseInWork.object = null;
        break;
      case 'torch':
        this.btInWork.innerHTML = 'T';
        this.caseInWork.object = null;
        break;
      case 'item':
        this.btInWork.innerHTML = 'I';
        this.caseInWork.object = null;
        break;
    }
  }
}
