import { Component } from '@angular/core';
import { PoMenuItem } from '@po-ui/ng-components';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  constructor(private router: Router, private route: ActivatedRoute){ }

  readonly menus: Array<PoMenuItem> = [
    { label: 'Dashboard', action: this.goToDashboard.bind(this), icon:"po-icon po-icon-chart-columns", shortLabel:"Dashboard" },
  ];

  private goToDashboard() {
    this.router.navigate(['./dashboard'], { relativeTo: this.route})
  }
}
