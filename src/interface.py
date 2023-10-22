# GUI Code
import sys

from PyQt6.QtWidgets import (
    QApplication,
    QMainWindow,
    QStatusBar,
    QToolBar,
    QHBoxLayout,
    QPushButton,
    QWidget
)

class Window(QMainWindow):

    def __init__(self):
        super().__init__(parent=None)
        self.setWindowTitle("Basic Window object")
        self._createCentralWidget()   # Creating the central layout of horizontal
        self._createMenu()
        self._createToolBar()
        self._createStatusBar()

    def _createCentralWidget(self):
        # Create the horizontal layout and add buttons to it
        layout = QHBoxLayout()
        layout.addWidget(QPushButton("Left"))
        layout.addWidget(QPushButton("Center"))
        layout.addWidget(QPushButton("Right"))
        
        # Create a central widget and set its layout to the QHBoxLayout
        central_widget = QWidget(self)
        central_widget.setLayout(layout)

        # Set the central widget of QMainWindow to the widget we just created
        self.setCentralWidget(central_widget)

    def _createMenu(self):
        menu = self.menuBar().addMenu("&Menu")
        menu.addAction("&Exit", self.close)

    def _createToolBar(self):
        tools = QToolBar()
        tools.addAction("Exit", self.close)
        self.addToolBar(tools)

    def _createStatusBar(self):
        status = QStatusBar()
        status.showMessage("I'm the Status Bar")
        self.setStatusBar(status)

if __name__ == "__main__":
    print("Running interface.py!")
    app = QApplication([])
    window = Window()
    window.show()
    sys.exit(app.exec())