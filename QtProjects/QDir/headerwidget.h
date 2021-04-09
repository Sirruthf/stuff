#ifndef HEADERWIDGET_H
#define HEADERWIDGET_H

#include <QApplication>
#include <QMouseEvent>
#include <QDrag>
#include <QMimeData>
#include <QFrame>
#include <QPropertyAnimation>
#include <QScrollBar>

#include "headeritemwidget.h"


class HeaderWidget : public QFrame
{
    Q_OBJECT

private:
    int scrollbarWidth = 0;
    int lw = 1;
    static const int MARGIN_BASE = 8;
    static const int MB = MARGIN_BASE;

    QVector<HeaderItemWidget*> cells;

public:
    bool hasBorder = true;
    bool hasHover = false;
    bool hasFill = false;
    float cellWidth;

    HeaderWidget(QVector<QString> paths, QWidget* parent = nullptr);

    void addScrollbar ();
    void removeScrollbar ();
    void paintEvent (QPaintEvent*);
    void updateCellGeometry (bool hasHScroll, bool hasVScroll);

    HeaderItemWidget* cellById (int _id);
    HeaderItemWidget* cellAt (int _ind);
    int getCellSpot (int _ind);
    QStringList cellNames();
    QVector<int> cellIndexes();

    void mousePressEvent(QMouseEvent*);
    void dragMoveEvent(QDragMoveEvent*);
    void dragEnterEvent(QDragEnterEvent*);
    void dragLeaveEvent(QDragLeaveEvent*);
    void dropEvent(QDropEvent*);


    static int getCoordIndex(int x, int cellNum, int cellWidth) {
        int newIndex = roundf((float)x / cellWidth);
        if (newIndex >= cellNum - 1) newIndex = cellNum - 1;
        if (newIndex <= 0) newIndex = 0;

        return newIndex;
    }

signals:
    void orderChanged();

};

#endif // HEADERWIDGET_H
