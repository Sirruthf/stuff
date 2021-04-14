#ifndef FSPARAMS_H
#define FSPARAMS_H

#include <QString>
#include <QVector>
#include <QFile>
#include <QTextStream>
#include <QColor>
#include <QDebug>


class FSParams
{
public:
    QString BASE_PATH;
    int PATHCOUNT;
    QStringList PATHS;
    QColor CLR_INACTIVE_BASE;
    QColor CLR_INACTIVE_ACCENT;
    QColor CLR_ACTIVE_BASE;
    QColor CLR_ACTIVE_ACCENT;

    FSParams (QString path);
    void save();

private:
    QString ini;
    void spawnDefault ();
};

#endif // FSPARAMS_H
