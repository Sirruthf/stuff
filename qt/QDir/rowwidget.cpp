#include "rowwidget.h"
#include "rowstyleoption.h"
#include "qdstyle.h"


RowWidget::RowWidget()
{
    this->setup();
}

RowWidget::RowWidget(int length)
{
    this->setup();

    for (int i = 0; i < length; i++) {
        cells.push_back(new QLabel(this));
        cells[i]->setContentsMargins(12, 8, 12, 8);
        this->layout()->addWidget(cells[i]);
    }
}

RowWidget::RowWidget(std::initializer_list<const char*> l)
{
    this->setup();

    int i = 0;
    for (auto &t : l) {
        cells.push_back(new QLabel(t));
        cells[i]->setContentsMargins(12, 8, 12, 8);
        this->layout()->addWidget(cells[i++]);
    }
}

RowWidget::RowWidget(QStringList l)
{
    this->setup();

    int i = 0;

    for (auto &t : l) {
        cells.push_back(new QLabel(t));
        cells[i]->setContentsMargins(12, 8, 12, 8);
        this->layout()->addWidget(cells[i++]);
    }
}

void RowWidget::enterEvent(QEnterEvent* event)
{
    QWidget::enterEvent(event);
    this->hasHover = true;
}

void RowWidget::leaveEvent(QEvent* event)
{
    QWidget::leaveEvent(event);
    this->hasHover = false;
}

void RowWidget::paintEvent(QPaintEvent *)
{
    QPainter p(this);
    RowStyleOption option;
    option.initFrom(this);

    this->style()->drawPrimitive((QStyle::PrimitiveElement)QDStyle::PE_RowWidget, &option, &p, this);
}

void RowWidget::setLabel(int i, QString str)
{
    if (str == "" && cells[i]->text() != "")
        labelCount--;
    if (str != "" && cells[i]->text() == "")
        labelCount++;
    this->hasConflict = labelCount > 1;

    cells[i]->setText(str);
}

void RowWidget::setup ()
{
    this->setLayout(new QHBoxLayout);
    this->setStyle(new QDStyle);
    this->layout()->setSpacing(0);
    this->layout()->setContentsMargins(0, 0, 0, 0);
    this->setAttribute(Qt::WA_Hover, true);
}
