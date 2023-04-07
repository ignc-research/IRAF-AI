import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorldGeneratorRoutingModule } from './world-generator-routing.module';
import { WorldGeneratorComponent } from './world-generator.component';
import { NgtCanvasModule } from '@angular-three/core';
import { RobotComponent } from './components/scene/scene-node/robot/robot.component';
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
import { NgtLineBasicMaterialModule, NgtMeshPhongMaterial, NgtMeshStandardMaterialModule } from '@angular-three/core/materials';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { NgtAxesHelperModule } from '@angular-three/core/helpers';
import { NgtAmbientLightModule, NgtPointLightModule, NgtSpotLightModule } from '@angular-three/core/lights';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { NgtBufferGeometryModule, NgtPlaneGeometryModule, NgtSphereGeometryModule } from '@angular-three/core/geometries';
import { MatInputModule } from '@angular/material/input';
import { TransformInputComponent } from './components/object-inspector/transform-input/transform-input.component';
import { MatCardModule } from '@angular/material/card';
import { TransformModeSelectorComponent } from './components/toolbar-top/transform-mode-selector/transform-mode-selector.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TransformControlsComponent } from './components/transform-controls/transform-controls.component';
import { ZoomControlsComponent } from './components/toolbar-top/zoom-controls/zoom-controls.component';
import { RobotPopoverComponent } from './components/scene/scene-node/robot/robot-popover/robot-popover.component';
import { SensorComponent } from './components/scene/scene-node/sensor/sensor.component';
import { ObstacleSelectorComponent } from './components/toolbar-top/obstacle-selector/obstacle-selector.component';
import { ObstacleComponent } from './components/scene/scene-node/obstacle/obstacle.component';
import { TreeViewComponent } from './components/tree-view/tree-view.component';
import { MatListModule } from '@angular/material/list';
import { ObstacleDialogComponent } from './components/toolbar-top/obstacle-selector/obstacle-dialog/obstacle-dialog.component';
import { ParameterEditorComponent } from './components/parameter-editor/parameter-editor.component';
import { ParameterInputComponent } from './components/parameter-editor/parameter-input/parameter-input.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ObjectPropertiesComponent } from './components/object-inspector/object-properties/object-properties.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SceneComponent } from './components/scene/scene.component';
import { TreeViewItemComponent } from './components/tree-view/tree-view-item/tree-view-item.component';
import { TrajectoryEditorComponent } from './components/object-inspector/object-properties/trajectory-editor/trajectory-editor.component';
import { SceneNodeComponent } from './components/scene/scene-node/scene-node.component';
import { GroupNodeComponent } from './components/scene/scene-node/group-node/group-node.component';
import { MarkerComponent } from './components/scene/scene-node/marker/marker.component';
import { ConfigSelectorComponent } from './components/toolbar-top/config-selector/config-selector.component';
import { TrajectoryComponent } from './components/scene/scene-node/trajectory/trajectory.component';
import { Vec3InputComponent } from './components/parameter-editor/parameter-input/vec3-input/vec3-input.component';
import { ColorInputComponent } from './components/parameter-editor/parameter-input/color-input/color-input.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { ExpandableComponent } from './components/parameter-editor/expandable/expandable.component';
import { MotionReplayComponent } from './components/motion-replay/motion-replay.component';
import { MatSliderModule } from '@angular/material/slider';

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
    ObstacleDialogComponent,
    ParameterEditorComponent,
    ParameterInputComponent,
    ObjectPropertiesComponent,
    SceneComponent,
    TreeViewItemComponent,
    TrajectoryEditorComponent,
    SceneNodeComponent,
    GroupNodeComponent,
    MarkerComponent,
    ConfigSelectorComponent,
    TrajectoryComponent,
    Vec3InputComponent,
    ColorInputComponent,
    ExpandableComponent,
    MotionReplayComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    WorldGeneratorRoutingModule,

    ColorPickerModule,

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
    MatSliderModule,
    MatToolbarModule,
    MatChipsModule,
    
    // Angular Three
    NgtAxesHelperModule,
    NgtAmbientLightModule,
    NgtMeshModule,
    NgtGroup,
    NgtLineBasicMaterialModule,
    NgtBufferGeometryModule,
    NgtMeshStandardMaterialModule,
    NgtMeshPhongMaterial,
    NgtPointLightModule,
    NgtPlaneGeometryModule,
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
