#ifndef ROWLAYOUT_H
#define ROWLAYOUT_H

#include <QHBoxLayout>
#include <QLabel>


class RowLayout : public QHBoxLayout
{
    Q_OBJECT
public:
    explicit RowLayout(QWidget *parent = nullptr);
    void addCell(QLabel*);

private:
    QVector<QLabel*> cells = QVector<QLabel*>();
};

#endif // ROWLAYOUT_H
