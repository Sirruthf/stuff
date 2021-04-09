#include "headeritemwidget.h"
#include "headeritemstyleoption.h"
#include "qdstyle.h"


HeaderItemWidget::HeaderItemWidget(QString str, int i, int id, QWidget* parent) :
    QLabel(str, parent),
    index(i),
    id(id)
{
    this->setStyle(new QDStyle);
    this->setAttribute(Qt::WA_Hover, true);
    this->setContentsMargins(12, 8, 12, 8);
    this->anim = new QPropertyAnimation(this, "left", this);
}

void HeaderItemWidget::setX (int _nval)
{
    this->move(_nval, this->y());
}

void HeaderItemWidget::moveAnim(int to, int dur)
{
    anim->setDuration(dur);
    anim->setEasingCurve(curve);
    anim->setStartValue(this->x());
    anim->setEndValue(to);
    anim->start();
}

void HeaderItemWidget::enterEvent(QEnterEvent* event)
{
    QWidget::enterEvent(event);
    this->hasHover = true;
}

void HeaderItemWidget::leaveEvent(QEvent* event)
{
    QWidget::leaveEvent(event);
    this->hasHover = false;
}

void HeaderItemWidget::paintEvent(QPaintEvent *)
{
//    qDebug() << "HIW:" << this->rect() << qobject_cast<QWidget*>(parent())->rect();

    QPainter p(this);
    HeaderItemStyleOption option;
    option.initFrom(this);

    QRect adj = option.rect; adj.adjust(12, 8, -12, -8);

    this->style()->drawPrimitive((QStyle::PrimitiveElement)QDStyle::PE_HeaderItemWidget, &option, &p, this);
    this->style()->drawItemText(&p, adj, Qt::AlignVCenter | Qt::AlignLeft, QGuiApplication::palette(), true, this->text());
}
