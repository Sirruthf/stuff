#include "headerstyleoption.h"
#include "headerwidget.h"


void HeaderStyleOption::initFrom(QWidget *_other)
{
    HeaderWidget* other = qobject_cast<HeaderWidget*>(_other);

    this->hasHover = other->hasHover;
    this->hasBorder = other->hasBorder;
    this->hasFill = other->hasFill;
    this->margin = other->contentsMargins();

    QStyleOption::initFrom(other);
}
