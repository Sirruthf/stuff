#ifndef ROWWIDGET_H
#define ROWWIDGET_H

#include <QWidget>
#include <QLabel>
#include <QHBoxLayout>
#include <QPainter>


class RowWidget: public QWidget
{
    Q_OBJECT

private:
    int labelCount = 0;
    QVector<QLabel*> cells = QVector<QLabel*>();
    void setup ();

public:
    bool isHighlitable = true;
    bool hasConflict = false;
    bool hasHover = false;
    bool hasBorder = false;
    QMargins margin;

    void enterEvent (QEnterEvent*);
    void leaveEvent (QEvent*);
    void paintEvent(QPaintEvent*);

    void setLabel (int, QString);


    RowWidget();
    RowWidget(int);
    RowWidget(std::initializer_list<const char*>);
    RowWidget(QStringList);
};

#endif // ROWWIDGET_H
