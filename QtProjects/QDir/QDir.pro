QT       += core gui

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

CONFIG += c++11

# You can make your code fail to compile if it uses deprecated APIs.
# In order to do so, uncomment the following line.
#DEFINES += QT_DISABLE_DEPRECATED_BEFORE=0x060000    # disables all the APIs deprecated before Qt 6.0.0

SOURCES += \
    fsparams.cpp \
    headeritemstyleoption.cpp \
    headeritemwidget.cpp \
    headerstyleoption.cpp \
    headerwidget.cpp \
    main.cpp \
    mainwindow.cpp \
    qdstyle.cpp \
    rowlistmanager.cpp \
    rowstyleoption.cpp \
    rowwidget.cpp

HEADERS += \
    fsparams.h \
    headeritemstyleoption.h \
    headeritemwidget.h \
    headerstyleoption.h \
    headerwidget.h \
    mainwindow.h \
    qdstyle.h \
    rowlistmanager.h \
    rowstyleoption.h \
    rowwidget.h

FORMS += \
    mainwindow.ui

# Default rules for deployment.
qnx: target.path = /tmp/$${TARGET}/bin
else: unix:!android: target.path = /opt/$${TARGET}/bin
!isEmpty(target.path): INSTALLS += target

DISTFILES +=

RESOURCES += \
    default.qrc
