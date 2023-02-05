import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorldGeneratorRoutingModule } from './world-generator-routing.module';
import { WorldGeneratorComponent } from './world-generator.component';
import { NgtCanvasModule } from '@angular-three/core';
import { RobotComponent } from './components/scene/robot/robot.component';
import { InformationComponent } from './components/information/information.component';
import { ToolbarTopComponent } from './components/toolbar-top/toolbar-top.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ObjectInspectorComponent } from './components/object-inspector/object-inspector.component';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtSobaOrbitControlsModule, NgtSobaTransformControlsModule } from '@angular-three/soba/controls';
import { NgtPrimitiveModule } from '@angular-three/core/primitive';
import { NgtGroup } from '@angular-three/core/group';
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
import { TransformControlsComponent } from './components/transform-controls/transform-controls.component';
import { ZoomControlsComponent } from './components/toolbar-top/zoom-controls/zoom-controls.component';
import { RobotPopoverComponent } from './components/scene/robot/robot-popover/robot-popover.component';
import { SensorComponent } from './components/scene/sensor/sensor.component';
import { ObstacleSelectorComponent } from './components/toolbar-top/obstacle-selector/obstacle-selector.component';
import { ObstacleComponent } from './components/scene/obstacle/obstacle.component';
import { TreeViewComponent } from './components/tree-view/tree-view.component';
import { MatListModule } from '@angular/material/list';
import { EnvironmentInspectorComponent } from './components/object-inspector/environment-inspector/environment-inspector.component';
import { ObstacleDialogComponent } from './components/toolbar-top/obstacle-selector/obstacle-dialog/obstacle-dialog.component';
import { ParameterEditorComponent } from './components/parameter-editor/parameter-editor.component';
import { ParameterInputComponent } from './components/parameter-editor/parameter-input/parameter-input.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ObjectPropertiesComponent } from './components/object-inspector/object-properties/object-properties.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SceneComponent } from './components/scene/scene.component';

@NgModule({
  
  declarations: [
    RobotComponent,
    ObjectInspectorComponent,
    ToolbarTopComponent,
    RobotSelectorComponent,
    InformationComponent,
    UrdfPreviewComponent,
    UrdfPreviewCanvasComponent,
    UrdfPreviewDialogComponent,
    WorldGeneratorComponent,
    TransformInputComponent,
    TransformModeSelectorComponent,
    TransformControlsComponent,
    ZoomControlsComponent,
    RobotPopoverComponent,
    SensorComponent,
    ObstacleSelectorComponent,
    ObstacleComponent,
    TreeViewComponent,
    EnvironmentInspectorComponent,
    ObstacleDialogComponent,
    ParameterEditorComponent,
    ParameterInputComponent,
    ObjectPropertiesComponent,
    SceneComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    WorldGeneratorRoutingModule,

    // Material Design
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatListModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatToolbarModule,
    MatChipsModule,
    
    // Angular Three
    NgtAxesHelperModule,
    NgtAmbientLightModule,
    NgtMeshModule,
    NgtGroup,
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
