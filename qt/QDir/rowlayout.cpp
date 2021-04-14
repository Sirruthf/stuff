#include "rowlayout.h"
#include <QLabel>



RowLayout::RowLayout(QWidget *parent) :
    QHBoxLayout(parent)
{
}

void RowLayout::addCell(QLabel* cell)
{
    cells.push_back(cell);
    addWidget(cell);
}

