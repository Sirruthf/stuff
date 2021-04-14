#include "qdstyle.h"
#include "rowstyleoption.h"
#include "headeritemstyleoption.h"
#include "headerstyleoption.h"


void QDStyle::drawPrimitive(QStyle::PrimitiveElement element, const QStyleOption *_option, QPainter *painter, const QWidget* widget) const
{
    QPalette::ColorRole role;
    QPalette::ColorGroup group;

    switch ((QDStyle::PrimitiveElement)element)
    {
    case QDStyle::PE_RowWidget: {
        const RowStyleOption* option = qstyleoption_cast<const RowStyleOption*>(_option);
        role = option->hasConflict ? QPalette::Highlight : QPalette::Base;
        group = option->hasHover && option->isHighlatable ? QPalette::Active : QPalette::Inactive;

        QRect rect = option->rect;
        rect.adjust(option->margin.left(), option->margin.top(), -option->margin.right(), -option->margin.bottom());
        QRect border = option->rect;
        border.adjust(0, 0, -1, 0);

        painter->fillRect(rect, option->palette.color(group, role));
        if (option->hasBorder) {
            painter->setPen(QPen(option->palette.brush(group, role), 1, Qt::SolidLine, Qt::SquareCap, Qt::BevelJoin));
            painter->drawRect(border);
        }

        break;
    }

    case QDStyle::PE_HeaderWidget: {
        const HeaderStyleOption* option = qstyleoption_cast<const HeaderStyleOption*>(_option);
        role = QPalette::Base;
        group = QPalette::Active;

        if (option->hasFill) {
            QRect rect = option->rect;
            qDebug() << "fill: " << rect;
            rect.adjust(option->margin.left(), option->margin.top(), -option->margin.right(), -option->margin.bottom());

            painter->fillRect(rect, option->palette.color(group, role));
        }

        if (option->hasBorder) {
            QRect border = option->rect;
            border.adjust(0, 0, -1, 0);

            painter->setPen(QPen(option->palette.brush(group, role), 1, Qt::SolidLine, Qt::SquareCap, Qt::BevelJoin));
            painter->drawRect(border);
        }

        break;
    }

    case QDStyle::PE_HeaderItemWidget: {
        const HeaderItemStyleOption* option = qstyleoption_cast<const HeaderItemStyleOption*>(_option);

        QPalette::ColorGroup group = option->hasHover || option->hasForceHover ? QPalette::Active : QPalette::Inactive;
        QPalette::ColorRole role = QPalette::Base;

        painter->fillRect(option->rect, option->palette.color(group, role));
        break;
    }

    default:
        QCommonStyle::drawPrimitive(element, _option, painter, widget);
    }
}
