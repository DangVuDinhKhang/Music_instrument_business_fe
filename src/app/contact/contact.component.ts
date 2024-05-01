import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit{

  ngOnInit(): void {
    window.scrollTo(0, 0); // Cuộn lên đầu trang khi trang được load
  }

}
