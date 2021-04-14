#include "rowstyleoption.h"
#include "rowwidget.h"


void RowStyleOption::initFrom(QWidget *_other)
{
    RowWidget* other = qobject_cast<RowWidget*>(_other);

    this->isHighlatable = other->isHighlitable;
    this->hasConflict = other->hasConflict;
    this->hasHover = other->hasHover;
    this->hasBorder = other->hasBorder;
    this->margin = other->contentsMargins();

    QStyleOption::initFrom(other);
}
