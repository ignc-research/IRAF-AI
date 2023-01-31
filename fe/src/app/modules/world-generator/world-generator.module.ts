import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorldGeneratorRoutingModule } from './world-generator-routing.module';
import { WorldGeneratorComponent } from './world-generator.component';
import { NgtCanvasModule } from '@angular-three/core';
import { RobotComponent } from './components/robot/robot.component';
import { InformationComponent } from './components/information/information.component';
import { PopoverComponent } from './components/popover/popover.component';
import { UserDataComponent } from './components/object-inspector/user-data/user-data.component';
import { HttpClientModule } from '@angular/common/http';
import { ToolbarTopComponent } from './components/toolbar-top/toolbar-top.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ObjectInspectorComponent } from './components/object-inspector/object-inspector.component';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtSobaOrbitControlsModule, NgtSobaTransformControlsModule } from '@angular-three/soba/controls';
import { NgtPrimitiveModule } from '@angular-three/core/primitive';
import { UrdfPreviewComponent } from './components/urdf-preview/urdf-preview.component';
import { UrdfPreviewCanvasComponent } from './components/urdf-preview/urdf-preview-canvas/urdf-preview-canvas.component';
import { UrdfPreviewDialogComponent } from './components/urdf-preview/urdf-preview-dialog/urdf-preview-dialog.component';
import { RobotSelectorComponent } from './components/toolbar-top/robot-selector/robot-selector.component';
import { NgtMeshStandardMaterialModule } from '@angular-three/core/materials';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { NgtAxesHelperModule } from '@angular-three/core/helpers';
import { NgtAmbientLightModule, NgtPointLightModule, NgtSpotLightModule } from '@angular-three/core/lights';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { NgtSphereGeometryModule } from '@angular-three/core/geometries';
import { MatInputModule } from '@angular/material/input';
import { TransformInputComponent } from './components/object-inspector/transform-input/transform-input.component';
import { MatCardModule } from '@angular/material/card';
import { TransformModeSelectorComponent } from './components/toolbar-top/transform-mode-selector/transform-mode-selector.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { RobotInspectorComponent } from './components/object-inspector/robot-inspector/robot-inspector.component';
import { TransformControlsComponent } from './components/transform-controls/transform-controls.component';
import { ZoomControlsComponent } from './components/toolbar-top/zoom-controls/zoom-controls.component';

@NgModule({
  
  declarations: [
    RobotComponent,
    ObjectInspectorComponent,
    ToolbarTopComponent,
    RobotSelectorComponent,
    InformationComponent,
    UserDataComponent,
    PopoverComponent,
    UrdfPreviewComponent,
    UrdfPreviewCanvasComponent,
    UrdfPreviewDialogComponent,
    WorldGeneratorComponent,
    TransformInputComponent,
    TransformModeSelectorComponent,
    RobotInspectorComponent,
    TransformControlsComponent,
    ZoomControlsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    WorldGeneratorRoutingModule,

    // Material Design
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatToolbarModule,
    
    // Angular Three
    NgtAxesHelperModule,
    NgtAmbientLightModule,
    NgtMeshModule,
    NgtMeshStandardMaterialModule,
    NgtPointLightModule,
    NgtPrimitiveModule,
    NgtSphereGeometryModule,
    NgtSpotLightModule,
    NgtSobaTransformControlsModule,
    NgtSobaOrbitControlsModule,
    NgtCanvasModule,
  ],
  exports: [

  ]
})
export class WorldGeneratorModule { }
