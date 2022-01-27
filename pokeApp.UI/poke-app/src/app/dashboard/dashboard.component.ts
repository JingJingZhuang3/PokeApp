import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';
import { CardService } from '../card.service';
import { Card } from '../Card';
import { ModalService } from '../_modal';
import { User } from '../User';
import { UserService } from '../user.service';
import { UserDto } from '../UserDto';
@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(
    public auth: AuthService,
    @Inject(DOCUMENT) private doc: Document,
    private cardService: CardService,
    private modalService: ModalService,
    private userService: UserService
  ) {}
  profileJson: string = '';
  /**
   * type assertion on user -> will autocomplete Employee properties
   * Compiler will provide autocomplete properties,
   * but will not give an error if you forgot to add the properties
   **/
  tradableCards: Card[] = [];
  params: any;
  userName: string = '';
  cardID: number = 0;

  userCards: Card[] = [];
  dbUserInfo: User[] = [];
  ngOnInit(): void {
    this.AddUser();
    this.GetTradableCards();
  }

  GetTradableCards(): void {
    this.cardService.GetTradableCards().then((data) => {
      this.tradableCards = data;
    });
  }

  logout(): void {
    console.log(this.doc.location);
    this.auth.logout({ returnTo: this.doc.location.origin });
    alert('Successfully logout!');
  }

  openModal(id: number, username: string) {
    console.log('Trade info: card id=' + id + ', username=' + username);
    // debugger;
    this.modalService.open(id.toString());
    this.userName = username;
    this.cardID = id;
  }

  closeModal(id: number) {
    this.modalService.close(id.toString());
  }
  buttonName: string = 'Profile';
  isShow: boolean = true;
  toggle(): void {
    this.isShow = !this.isShow;
    if (!this.isShow) this.buttonName = 'Dashboard';
    else this.buttonName = 'Profile';
  }
  // add user/get user & get user collection
  AddUser(): void {
    this.auth.user$.subscribe((profile) => {
      let body = <UserDto>{
        name: profile?.nickname,
        pw: 'psw',
        email: profile?.email,
      };
      // debugger;
      return this.userService.addUser(body).then((data) => {
        // console.log(data);
        // debugger;
        this.dbUserInfo = data;
        // this.userService.userid = data[0].userID;
        this.cardService.GetUserCards(data[0].userID).then((data) => {
          this.userCards = data;
        });
        // debugger;
      });
    });
  }
}
