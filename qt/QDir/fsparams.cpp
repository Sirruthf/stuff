#include "fsparams.h"


FSParams::FSParams (QString path)
{
    this->ini = path;

    QFile iniFile(path);

    if (!iniFile.open(QIODevice::ReadOnly | QIODevice::Text))
    {
        qDebug() << "failed to open";
        this->spawnDefault();
        iniFile.open(QIODevice::ReadOnly | QIODevice::Text);
    }
    else if (iniFile.size() == 0)
    {
        qDebug() << "failed to read";
        iniFile.close();
        this->spawnDefault();
        iniFile.open(QIODevice::ReadOnly | QIODevice::Text);
    }

    QTextStream in(&iniFile);
    while (!in.atEnd()) {
        QString line = in.readLine();
        QString name = line.split(" = ")[0];
        QString value = line.split(" = ")[1];

        if (name == "PATHCOUNT")
            PATHCOUNT = value.toInt();
        else if (name == "BASE_PATH")
            BASE_PATH = value;
        else if (name == "PATHS")
            PATHS = value.split(", ");
        else
        {
            QVector<int> rgb = QVector<int>();
            for (auto& l : value.split(", "))
                rgb << l.toInt();

            if (name == "CLR_INACTIVE_BASE")
                CLR_INACTIVE_BASE = QColor(rgb[0], rgb[1], rgb[2]);
            if (name == "CLR_INACTIVE_ACCENT")
                CLR_INACTIVE_ACCENT = QColor(rgb[0], rgb[1], rgb[2]);
            if (name == "CLR_ACTIVE_BASE")
                CLR_ACTIVE_BASE = QColor(rgb[0], rgb[1], rgb[2]);
            if (name == "CLR_ACTIVE_ACCENT")
                CLR_ACTIVE_ACCENT = QColor(rgb[0], rgb[1], rgb[2]);
        }
    }
}

void FSParams::save()
{
    QFile iniFile(this->ini);
    iniFile.open(QIODevice::WriteOnly | QIODevice::Text);
    QTextStream out(&iniFile);

    out << "PATHCOUNT = " << PATHCOUNT << Qt::endl;
    out << "BASE_PATH = " << BASE_PATH << Qt::endl;
    out << "PATHS = " << PATHS.join(", ") << Qt::endl;
    out << "CLR_INACTIVE_BASE = "   << CLR_INACTIVE_BASE.red()   << ", " << CLR_INACTIVE_BASE.green()   << ", " << CLR_INACTIVE_BASE.blue() << Qt::endl;
    out << "CLR_INACTIVE_ACCENT = " << CLR_INACTIVE_ACCENT.red() << ", " << CLR_INACTIVE_ACCENT.green() << ", " << CLR_INACTIVE_ACCENT.blue() << Qt::endl;
    out << "CLR_ACTIVE_BASE = "     << CLR_ACTIVE_BASE.red()     << ", " << CLR_ACTIVE_BASE.green()     << ", " << CLR_ACTIVE_BASE.blue() << Qt::endl;
    out << "CLR_ACTIVE_ACCENT = "   << CLR_ACTIVE_ACCENT.red()   << ", " << CLR_ACTIVE_ACCENT.green()   << ", " << CLR_ACTIVE_ACCENT.blue() << Qt::endl;
}

void FSParams::spawnDefault ()
{
    QFile iniFile(this->ini);
    iniFile.open(QIODevice::WriteOnly);
    QTextStream out(&iniFile);

    QFile _default(QStringLiteral(":/files/default.ini"));
    _default.open(QIODevice::ReadOnly);
    QTextStream in(&_default);

    out << in.readAll();
    out.flush();
}
