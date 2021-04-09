#include "headeritemstyleoption.h"
#include "headeritemwidget.h"


void HeaderItemStyleOption::initFrom(QWidget *_other)
{
    HeaderItemWidget* other = qobject_cast<HeaderItemWidget*>(_other);

    this->hasHover = other->hasHover;
    this->hasForceHover = other->hasForceHover;

    QStyleOption::initFrom(other);
}
