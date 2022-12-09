import { NgtCanvas } from '@angular-three/core';
import { Component } from '@angular/core';
import { NgtAmbientLight, NgtSpotLight, NgtPointLight } from '@angular-three/core/lights';
import { NgtAxesHelper } from '@angular-three/core/helpers';
import { NgtSobaOrbitControls } from '@angular-three/soba/controls';
import { CubeComponent } from './components/cube/cube.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  imports: [
    CubeComponent,
    NgtCanvas,
    NgtAxesHelper,
    NgtAmbientLight,
    NgtSpotLight,
    NgtPointLight,
    NgtSobaOrbitControls],
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

}
