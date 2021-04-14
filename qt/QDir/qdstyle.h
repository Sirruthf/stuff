#ifndef ROWSTYLE_H
#define ROWSTYLE_H

#include <QCommonStyle>
#include <QPainter>
#include <QStyleOption>


class QDStyle: public QCommonStyle
{
    Q_OBJECT

public:
    enum PrimitiveElement {
        PE_RowWidget = QStyle::PrimitiveElement::PE_CustomBase + 1,
        PE_HeaderWidget,
        PE_HeaderItemWidget,
    };

    void drawPrimitive(QStyle::PrimitiveElement, const QStyleOption*, QPainter*, const QWidget*) const;
};

#endif // ROWSTYLE_H
