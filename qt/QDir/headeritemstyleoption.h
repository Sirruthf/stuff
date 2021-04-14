#ifndef CELLSTYLEOPTION_H
#define CELLSTYLEOPTION_H

#include <QStyleOption>


class HeaderItemStyleOption: public QStyleOption
{
public:
    void initFrom (QWidget*);

    bool hasHover;
    bool hasForceHover;
};

#endif // CELLSTYLEOPTION_H
