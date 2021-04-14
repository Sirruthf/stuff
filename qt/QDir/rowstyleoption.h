#ifndef ROWSTYLEOPTION_H
#define ROWSTYLEOPTION_H

#include <QStyleOption>


class RowStyleOption: public QStyleOption
{
public:
    bool isHighlatable;
    bool hasConflict;
    bool hasHover;
    bool hasBorder;
    QMargins margin;

    void initFrom (QWidget* other);
};

#endif // ROWSTYLEOPTION_H
