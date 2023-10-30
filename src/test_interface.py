import sys
from PyQt6.QtCore import Qt
from PyQt6.QtGui import QPainter, QBrush, QPen, QColor
from PyQt6.QtWidgets import QApplication, QWidget, QScrollArea, QVBoxLayout

class DAGWidget(QWidget):
    def __init__(self, adjacency_list):
        super().__init__()
        self.adjacency_list = adjacency_list
        self.node_positions = {}
        self.horizontal_spacing = 500
        self.vertical_spacing = 100

    def calculate_node_positions(self, node, x, y):
        if node not in self.node_positions:
            self.node_positions[node] = (x, y)
            children = self.adjacency_list.get(node, [])
            num_children = len(children)
            if num_children > 0:
                spacing = self.horizontal_spacing // (num_children + 1)
                next_x = x - (self.horizontal_spacing // 2)
                for child in children:
                    next_x += spacing
                    self.calculate_node_positions(child, next_x, y + self.vertical_spacing)

    def paintEvent(self, event):
        painter = QPainter(self)
        painter.setRenderHint(QPainter.RenderHint.Antialiasing)
        pen = QPen()
        pen.setWidth(2)
        painter.setPen(pen)
        brush = QBrush(QColor(255, 255, 255))
        painter.setBrush(brush)

        if self.adjacency_list:
            root = next(iter(self.adjacency_list.keys()))
            self.calculate_node_positions(root, self.width() // 2, 30)

            for node, (x, y) in self.node_positions.items():
                for child in self.adjacency_list.get(node, []):
                    x2, y2 = self.node_positions[child]
                    painter.drawLine(x + 15, y +15 , x2 + 15, y2 + 15)
                
                painter.drawEllipse(x, y, 30, 30)
                painter.drawText(x + 11 , y + 20, str(node))

def main():
    app = QApplication(sys.argv)

    adjacency_list = {
        'A': ['B', 'C'],
        'B': ['D', 'E'],
        'C': ['F', 'G'],
        'D': ['H'],
        'E': ['I', 'J'],
        'F': ['K'],
        'G': [],
        'H': [],
        'I': [],
        'J': ['L', 'M'],
        'K': []
    }

    dag_widget = DAGWidget(adjacency_list)

    scroll_area = QScrollArea()
    scroll_area.setWidget(dag_widget)
    scroll_area.setWidgetResizable(True)

    main_window = QWidget()
    main_layout = QVBoxLayout()
    main_layout.addWidget(scroll_area)
    main_window.setLayout(main_layout)

    main_window.setWindowTitle("Scrollable DAG Visualization")
    main_window.setGeometry(100, 100, 800, 600)  # Adjust the width and height as needed
    main_window.show()

    sys.exit(app.exec())

if __name__ == '__main__':
    main()






