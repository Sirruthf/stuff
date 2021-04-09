#ifndef HEADERSTYLEOPTION_H
#define HEADERSTYLEOPTION_H

#include <QStyleOption>


class HeaderStyleOption : public QStyleOption
{
public:
    bool hasBorder;
    bool hasHover;
    bool hasFill;
    QMargins margin;

    void initFrom (QWidget* other);
};

#endif // HEADERSTYLEOPTION_H
