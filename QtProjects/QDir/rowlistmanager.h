#ifndef ROWLISTMANAGER_H
#define ROWLISTMANAGER_H

#include <QObject>
#include <QDebug>
#include "rowwidget.h"


class RowListManager: public QObject
{
    Q_OBJECT

public:
    void push (RowWidget*);
    void hideNonConf ();
    void showNonConf ();
    void clear();

private:
    QVector<RowWidget*> list;
    bool hidden = false;

public slots:
    void conflictClickSlot();

};

#endif // ROWLISTMANAGER_H
