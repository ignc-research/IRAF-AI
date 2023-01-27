case1: one single obstacle
the base position of the robot: (0.0,-0.12,0.5)
initial position of the end effector: (0.15,0.4,0.3)
target position: (-0.15,0.4,0.3)
obstacle:
	- shape: box, the side lengths of the three sides of xyz direction(world coordinates) are 0.004,0.2,0.1
	- the coordinates of the box center are (0.0, 0.4, 0.3)
introduction of the txt file:
	- use np.loadtxt to read the as ndarray traj
	- traj[:,0]: timestamp in second
	- traj[:,1:4]: current position of the tip of end effector in world coordinate system
	- traj[:,4:8]: current orientation in quaternion of the end effector refenced to world coordinate system
	- traj[:,8]: scalar of the velocity of end effector
	- traj[:,9:15]: angular velocity of each joint, the order is from the bottom of the robot to the top

