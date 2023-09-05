import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterState } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit{

  path = "a";
  constructor(private route: ActivatedRoute){}

  ngOnInit(): void {
      this.path = window.location.href.split("/")[4];
  }
  
}
