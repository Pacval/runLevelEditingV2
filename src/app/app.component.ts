import { Component, OnInit } from '@angular/core';
import { Case, Player, Enemy } from './case.model';
import { SelectItem } from './components/selectitem';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  author: string;
  difficulty: string;

  widthMap: number;
  heightMap: number;

  widthMapArray: number[];
  heightMapArray: number[];

  cases: Case[];
  caseInWork: Case;

  btInWork: HTMLElement;

  types: SelectItem[];
  enemyTypes: SelectItem[];
  itemInventoryTypes: SelectItem[];
  itemTypes: SelectItem[];

  result: string;

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

    this.itemInventoryTypes = [
      { label: 'Torche', value: 'TORCH' },
      { label: 'Hache', value: 'AXE' }
    ];

    this.itemTypes = [
      { label: 'Hache', value: 'AXE' }
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
        this.caseInWork.object = new Player(this.itemInventoryTypes);
        break;
      case 'enemy':
        this.btInWork.innerHTML = 'E';
        this.caseInWork.object = new Enemy();
        break;
      case 'exit':
        this.btInWork.innerHTML = 'X';
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

  controleGenerate() {
    //if ok 
    this.generate();
    // else message d'erreur
  }

  // fonction de génération du JSON
  generate() {
    // l'utilisateur peut modifier une case puis réduire la taille de la map pour la faire disparaitre.
    // Cependant elle est toujours stockée dans le back.
    // Donc on récupère d'abord toutes les cases qui sont dans la map finale.
    const casesInMap = this.cases.filter((x) => x.height < this.heightMap && x.width < this.widthMap);

    // initialisation
    this.result = '{'

    // difficulté
    this.result += '"difficulty": "' + this.difficulty + '",';

    // taille
    this.result += '"width": ' + this.widthMap + ',';
    this.result += '"height": ' + this.heightMap + ',';

    // joueurs (au moins 1)
    this.result += '"players": [';
    const playerCases = casesInMap.filter((x) => x.type === 'player');
    let firstPlayer = true;

    playerCases.forEach(player => {
      this.result += firstPlayer ? '{' : ',{';
      firstPlayer = false;

      this.result += '"x": ' + player.width + ',';
      this.result += '"y": ' + player.height + ',';
      this.result += '"visionRange": ' + player.object.visionRange + ',';
      this.result += '"inventory": {';
      this.result += '"items": [';

      let firstItem = true;
      Object.keys(player.object.inventory).forEach(item => {
        if (player.object.inventory[item] !== 0) {
          this.result += firstItem ? '{' : ',{';
          firstItem = false;

          this.result += '"type": "' + item + '",';
          this.result += '"number": ' + player.object.inventory[item];
          this.result += '}';
        }
      });
      this.result += ']'; // fin items
      this.result += '}'; // fin inventory
      this.result += '}'; // fin joueur
    });

    // fin des joueurs
    this.result += '],';

    // ennemis
    this.result += '"enemies": [';
    const enemyCases = casesInMap.filter((x) => x.type === 'enemy');
    let firstEnemy = true;

    enemyCases.forEach(enemy => {
      this.result += firstEnemy ? '{' : ',{';
      firstEnemy = false;

      this.result += '"enemyType": "' + enemy.object.type + '",';
      this.result += '"x": ' + enemy.width + ',';
      this.result += '"y": ' + enemy.height;
      this.result += '}';
    });
    this.result += '],';

    // sorties
    this.result += '"exits": [';
    const exitCases = casesInMap.filter((x) => x.type === 'exit');
    let firstExit = true;

    exitCases.forEach(exit => {
      this.result += firstExit ? '{' : ',{';
      firstExit = false;

      this.result += '"x": ' + exit.width + ',';
      this.result += '"y": ' + exit.height;
      this.result += '}';
    });
    this.result += '],';

    // obstacles
    this.result += '"obstacles": [';
    const obstacleCases = casesInMap.filter((x) => x.type === 'obstacle');
    let firstObstacle = true;

    obstacleCases.forEach(obstacle => {
      this.result += firstObstacle ? '{' : ',{';
      firstObstacle = false;

      this.result += '"x": ' + obstacle.width + ',';
      this.result += '"y": ' + obstacle.height;
      this.result += '}';
    });
    this.result += '],';

    // torches
    this.result += '"torches": [';
    const torchCases = casesInMap.filter((x) => x.type === 'torch');
    let firstTorch = true;

    torchCases.forEach(obstacle => {
      this.result += firstTorch ? '{' : ',{';
      firstTorch = false;

      this.result += '"x": ' + obstacle.width + ',';
      this.result += '"y": ' + obstacle.height;
      this.result += '}';
    });
    this.result += '],';

    // items
    this.result += '"items": [';
    const itemCases = casesInMap.filter((x) => x.type === 'item');
    let firstItem = true;

    itemCases.forEach(item => {
      this.result += firstItem ? '{' : ',{';
      firstItem = false;

      this.result += '"x": ' + item.width + ',';
      this.result += '"y": ' + item.height;
      this.result += '}';
    });
    this.result += ']';

    this.result += '}';

    console.log(this.result);
  }
}
