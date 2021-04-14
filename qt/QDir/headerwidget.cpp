#include "headerwidget.h"
#include "headerstyleoption.h"
#include "qdstyle.h"


HeaderWidget::HeaderWidget(QVector<QString> paths, QWidget* parent) : QFrame(parent)
{
    if (paths.size() <= 0) throw "paths array is empty";

    this->setFrameStyle(QFrame::Panel | QFrame::Plain);
    this->setStyle(new QDStyle);
    this->setContentsMargins(MARGIN_BASE, MARGIN_BASE, MARGIN_BASE, MARGIN_BASE);

    int i = 0;
    for (auto& l : paths) {
        cells.push_back(new HeaderItemWidget(l, i, i, this)); i++;
    }

    this->scrollbarWidth = 17;
    this->setAcceptDrops(true);


    this->setMinimumWidth(150);
    this->setMinimumWidth(0);
    this->setMinimumHeight(40 + MARGIN_BASE);
    this->setMinimumHeight(cells[0]->height() + MARGIN_BASE);
}

void HeaderWidget::paintEvent(QPaintEvent *)
{
    QPainter p(this);
    HeaderStyleOption option;
    option.initFrom(this);

    this->style()->drawPrimitive((QStyle::PrimitiveElement)QDStyle::PE_HeaderWidget, &option, &p, this);
}

void HeaderWidget::updateCellGeometry(bool hasHScroll, bool hasVScroll)
{
    this->setContentsMargins(MB, MB, MB * !hasHScroll + scrollbarWidth * hasVScroll, MB);

    QRect cont = this->contentsRect();

    int x = cont.x(), y = cont.y(), w = cont.width();
    this->cellWidth = roundf((float)w / cells.size());

    for (int i = 0; i < cells.size(); i++) {
        cells[i]->setMinimumWidth(cellWidth);
        cells[i]->setMaximumWidth(cellWidth);

        if (cells[i]->index < cells.size() - 1)
            cells[i]->move(x + lw + cells[i]->index * cellWidth, y);
        else
            cells[i]->move(x + w - cellWidth - 1, y);
        cells[i]->show();
    }
}

void HeaderWidget::mousePressEvent(QMouseEvent* event)
{
    HeaderItemWidget *child = static_cast<HeaderItemWidget*>(this->childAt(event->position().toPoint()));

    if (!child) return;

    child->raise();
    child->hasForceHover = true;

    int lshift = event->position().toPoint().x() - child->pos().x(); // what's funny, it also includes left margin

    QMimeData *mimeData = new QMimeData;
    mimeData->setText(child->text());
    mimeData->setData("application/x-hotspot", QByteArray::number(lshift));
    mimeData->setData("application/x-id", QByteArray::number(child->id));

    QDrag *drag = new QDrag(this);
    drag->setMimeData(mimeData);

    drag->exec(Qt::MoveAction);
}

void HeaderWidget::dragEnterEvent(QDragEnterEvent *event)
{
    if (event->mimeData()->hasText())
        if (event->source() == this)
            event->accept();
        else
            event->acceptProposedAction();
    else
        event->ignore();
}

void HeaderWidget::dragMoveEvent(QDragMoveEvent *event)
{
    int lshift = event->mimeData()->data("application/x-hotspot").toInt();
    int id = event->mimeData()->data("application/x-id").toInt();
    this->cellById(id)->move(event->position().x() - lshift, MARGIN_BASE);

    HeaderItemWidget* _new = this->cellById(id);
    HeaderItemWidget* _old = this->cellAt(getCoordIndex(_new->x(), cells.size(), cellWidth));

    if (!_old || _new == _old) return;

    _old->moveAnim(getCellSpot(_new->index));

    int _tmp = _old->index;
    _old->index = _new->index;
    _new->index = _tmp;

    emit orderChanged();
}

void HeaderWidget::dragLeaveEvent(QDragLeaveEvent *)
{
    for (int i = 0; i < cells.size(); i++) {
        if (cells[i]->x() != getCellSpot(cells[i]->index)) {
            cells[i]->moveAnim(getCellSpot(cells[i]->index));
            cells[i]->hasForceHover = false;
        }
    }
}

void HeaderWidget::dropEvent(QDropEvent *event)
{
    int id = event->mimeData()->data("application/x-id").toInt();

    HeaderItemWidget* _cell = this->cellById(id);

    _cell->moveAnim(getCellSpot(_cell->index));
    _cell->index = getCoordIndex(_cell->x(), cells.size(), cellWidth);
    _cell->hasForceHover = false;
}

QStringList HeaderWidget::cellNames()
{
    QStringList result(cells.size());

    for (int i = 0; i < cells.size(); i++)
        result[cells[i]->index] = cells[i]->text();

    return result;
}

QVector<int> HeaderWidget::cellIndexes()
{
    QVector<int> result(cells.size());

    for (int i = 0; i < cells.size(); i++)
        result[i] = cells[i]->index;

    return result;
}

HeaderItemWidget* HeaderWidget::cellById(int _id)
{
    for (int i = 0; i < cells.size(); i++)
        if (cells[i]->id == _id)
            return cells[i];
    return nullptr;
}

HeaderItemWidget* HeaderWidget::cellAt(int _ind)
{
    for (int i = 0; i < cells.size(); i++)
        if (cells[i]->index == _ind)
            return cells[i];
    return nullptr;
}

int HeaderWidget::getCellSpot(int _ind)
{
    QRect cont = this->contentsRect();
    int x = cont.x(), w = cont.width();

    if (_ind < cells.size() - 1)
        return x + lw + _ind * cellWidth;
    else
        return x + w - cellWidth - 1;
}

