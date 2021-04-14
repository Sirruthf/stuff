#ifndef HEADERITEM_H
#define HEADERITEM_H

#include <QLabel>
#include <QGuiApplication>
#include <QPropertyAnimation>


class HeaderItemWidget: public QLabel
{
    Q_OBJECT
    Q_PROPERTY(int left READ x WRITE setX)

private:
    static const int ANIM_DUR = 300;
    static const QEasingCurve::Type curve = QEasingCurve::InOutQuad;
    QPropertyAnimation* anim;

public:
    bool hasHover = false;
    bool hasForceHover = false;
    int index = 0;
    int id = 0;

    HeaderItemWidget(QString, int, int, QWidget* = nullptr);

    void setX(int);

    void moveAnim (int to, int dur = ANIM_DUR);

    void enterEvent (QEnterEvent* event);
    void leaveEvent (QEvent* event);

    void paintEvent (QPaintEvent *);

};

#endif // HEADERITEM_H
