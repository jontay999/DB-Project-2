# GUI Code
import sys

from PyQt6.QtCore import Qt
from PyQt6.QtWidgets import (
    QApplication,
    QMainWindow,
    QStatusBar,
    QToolBar,
    QHBoxLayout,
    QVBoxLayout,
    QGridLayout,
    QPushButton,
    QStackedLayout,
    QWidget,
    QLabel,
    QGraphicsView, 
    QGraphicsScene,
    QGraphicsProxyWidget,
    QFrame
)
from PyQt6.QtGui import QPalette, QColor

# input: dictionary
# queries = {
#     "1": 2,
#     "2": 3,
#     "3": [4,5],
#     "5": [6]
# }

# input: linked list
# queries = [[1], [2], [3,4], [], [5], []]

class Color(QWidget):

    def __init__(self, color):
        super(Color, self).__init__()
        self.setAutoFillBackground(True)

        palette = self.palette()
        palette.setColor(QPalette.ColorRole.Window, QColor(color))
        self.setPalette(palette)

class Window(QMainWindow):

    def __init__(self):
        super().__init__(parent=None)
        self.setWindowTitle("Query Tree Visualisation")
        self._createCentralWidget()   # Creating the central layout of horizontal

        # FOR TESTING
        # layout = QGridLayout()

        # layout.addWidget(Color('red'), 0, 0)
        # layout.addWidget(Color('green'), 1, 0)
        # layout.addWidget(Color('blue'), 1, 1)
        # layout.addWidget(Color('purple'), 2, 1)

        # widget = QWidget()
        # widget.setLayout(layout)
        # self.setCentralWidget(widget)

    def _createCentralWidget(self):  
        # FOR TESTING
        queries = [[1], [2], [3,4], [], [5], []]
        
        # stacklayout attempt
        self.stacklayout = QStackedLayout()

        # TODO: will need to figure out how to automate this position allocation
        # need to know: 
        #   - width (what is the max number of nodes in a row; + accomodate one side stop but other side continue splitting)
        #   - depth/level of EACH node

        posi = [[1,0], [1,1], [1,2], [0,3], [2,3], [2,4]]
        
        # tested with random larger X vals and it looked the same, so hypothetically, if we select a large enough number and went from there, it should work..?
        # posi = [[2,0], [2,1], [2,2], [1,3], [3,3], [3,4]]

        yvals = [0] * len(queries)
        for j in range(len(queries)):
            children = queries[j]
            for k in range(len(children)):
                yvals[children[k]] = yvals[j] + 1


        # Create the horizontal layout and add buttons to it
        layout = QGridLayout()

        for i in range(len(queries)):
            node = QVBoxLayout()
            # check if need top line
            if i > 0:
                line = QLabel("|")
                line.setAlignment(Qt.AlignmentFlag.AlignHCenter)
                node.addWidget(line)
            
            # add node itself
            nodeButton = QPushButton(str(i))
            # button functionality to link to info => NoneType error
            nodeButton.pressed.connect(self._activate_tab(int(i)))
            # add screen
            self.stacklayout.addWidget(QLabel("selected: " + str(i)))
            # add button
            node.addWidget(nodeButton)
            
            # check if hv > 1 children
            if len(queries[i]) > 1:
                line = QLabel("|")
                line.setAlignment(Qt.AlignmentFlag.AlignHCenter)
                node.addWidget(line)

                baseline = QLabel("__________")
                baseline.setAlignment(Qt.AlignmentFlag.AlignHCenter)
                node.addWidget(baseline)
            
            # insert into layout
            print("i: ", i)
            print("x,y: ", posi[i])
            layout.addLayout(node, posi[i][1], posi[i][0])
        
        # Create a central widget and set its layout to the QHBoxLayout
        central_widget = QWidget(self)
        central_widget.setLayout(layout)

        # Set the central widget of QMainWindow to the widget we just created
        self.setCentralWidget(central_widget)

    def _activate_tab(self, val):
        self.stacklayout.setCurrentIndex(val)


if __name__ == "__main__":
    print("Running interface.py!")
    app = QApplication([])
    window = Window()
    window.show()
    sys.exit(app.exec())