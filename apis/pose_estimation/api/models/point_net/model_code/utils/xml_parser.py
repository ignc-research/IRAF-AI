import xml.etree.ElementTree as ET
import numpy as np

def parse_frame_dump(xml_file):
    '''parse xml file to get welding spots and torch poses'''
    tree = ET.parse(xml_file)
    root = tree.getroot()
    
    total_info = [] # list of all infos about the torch, welding spots and the transformation matrix
    

    for SNaht in root.findall('SNaht'):
        
        torch = [SNaht.get('Name'), SNaht.get('ZRotLock'), SNaht.get('WkzWkl'), SNaht.get('WkzName')]
        weld_frames = [] # list of all weld_frames as np.arrays(X,Y,Z) in mm
        pose_frames = [] # list of all pose_frames as 4x4 homogenous transforms
        
        for Kontur in SNaht.findall('Kontur'):  
            for Punkt in Kontur.findall('Punkt'):
                X = float(Punkt.get('X'))
                Y = float(Punkt.get('Y'))
                Z = float(Punkt.get('Z'))
                Norm = []
                Rot_X, Rot_Y, Rot_Z, EA3 = 0, 0, 0, 0
                for Fl_Norm in Punkt.findall('Fl_Norm'):
                    Norm_X = float(Fl_Norm.get('X'))
                    Norm_Y = float(Fl_Norm.get('Y'))
                    Norm_Z = float(Fl_Norm.get('Z'))
                    Norm.append(np.array([Norm_X, Norm_Y, Norm_Z]))
                for Rot in Punkt.findall('Rot'):
                    Rot_X = float(Rot.get('X'))
                    Rot_Y = float(Rot.get('Y'))
                    Rot_Z = float(Rot.get('Z'))
                for Ext_Achswerte in Punkt.findall('Ext-Achswerte'):
                    EA3 = float(Ext_Achswerte.get('EA3'))
                weld_frames.append({'position': np.array([X, Y, Z]), 'norm': Norm, 'rot': np.array([Rot_X, Rot_Y, Rot_Z]), 'EA': EA3})

        # desired model output
        for Frames in SNaht.findall('Frames'):  
            for Frame in Frames.findall('Frame'):
                torch_frame = np.zeros((4,4))  # 4x4 homogenous transform
                torch_frame[3,3] = 1.0

                for Pos in Frame.findall('Pos'):
                    # 3x1 position
                    X = Pos.get('X')
                    Y = Pos.get('Y')
                    Z = Pos.get('Z')
                    torch_frame[0:3,3] = np.array([X,Y,Z])
                for XVek in Frame.findall('XVek'):
                    # 3x3 rotation
                    Xrot = np.array([XVek.get('X'), XVek.get('Y'), XVek.get('Z')])      
                    torch_frame[0:3, 0] = Xrot
                for YVek in Frame.findall('YVek'):
                    # 3x3 rotation
                    Yrot = np.array([YVek.get('X'), YVek.get('Y'), YVek.get('Z')])      
                    torch_frame[0:3, 1] = Yrot
                for ZVek in Frame.findall('ZVek'):
                    # 3x3 rotation
                    Zrot = np.array([ZVek.get('X'), ZVek.get('Y'), ZVek.get('Z')])      
                    torch_frame[0:3, 2] = Zrot

                #print(torch_frame) 
                pose_frames.append(torch_frame)
        
        total_info.append({'torch': torch, 'weld_frames': weld_frames, 'pose_frames': pose_frames})

    return total_info


def list2array(total_info):
    res = []
    for info in total_info:
        for i, spot in enumerate(info['weld_frames']):
            weld_info = []
            weld_info.append(info['torch'][0])
            weld_info.append(info['torch'][1])
            weld_info.append(info['torch'][2])
            torch = info['torch'][3]
            if torch == 'MRW510_10GH' or torch == 'MRW510_CDD_10GH':
                weld_info.append(0)
            elif torch  == 'TAND_GERAD_DD':
                weld_info.append(1)
            else:
                weld_info.append(2)
            weld_info.append(spot['position'][0])
            weld_info.append(spot['position'][1])
            weld_info.append(spot['position'][2])
            weld_info.append(spot['norm'][0][0])
            weld_info.append(spot['norm'][0][1])
            weld_info.append(spot['norm'][0][2])
            weld_info.append(spot['norm'][1][0])
            weld_info.append(spot['norm'][1][1])
            weld_info.append(spot['norm'][1][2])

            weld_info.append(spot['rot'][0])
            weld_info.append(spot['rot'][1])
            weld_info.append(spot['rot'][2])


            weld_info.append(spot['EA'])

            if len(info['pose_frames']) > 0:
                weld_info.append(info['pose_frames'][i][0][0])
                weld_info.append(info['pose_frames'][i][1][0])
                weld_info.append(info['pose_frames'][i][2][0])
                weld_info.append(info['pose_frames'][i][0][1])
                weld_info.append(info['pose_frames'][i][1][1])
                weld_info.append(info['pose_frames'][i][2][1])
                weld_info.append(info['pose_frames'][i][0][2])
                weld_info.append(info['pose_frames'][i][1][2])
                weld_info.append(info['pose_frames'][i][2][2])

            res.append(np.asarray(weld_info))
    return np.asarray(res)



if __name__== '__main__':
    t = parse_frame_dump('../data/test_ds2/models/1/1.xml')
    print (t)

